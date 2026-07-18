import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/hook/provider/AuthContext'
import { cartService } from '@/services/cart.service'
import { toast } from 'sonner'

const CartContext = createContext(null)

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart phải dùng trong CartProvider')
    return ctx
}

const resolvePrice = (product) => {
    if (typeof product.price === 'number' && !Number.isNaN(product.price)) return product.price
    if (product.gia != null) {
        const parsed = Number(product.gia)
        if (!Number.isNaN(parsed)) return parsed
    }
    return 0
}

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth()
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const updateTimeoutRef = useRef({})
    const mergingRef = useRef(false)

    const confirmedQtyRef = useRef({})

    const syncConfirmedQty = useCallback((list) => {
        const map = {}
        list.forEach(i => { map[i.id] = i.qty })
        confirmedQtyRef.current = map
    }, [])

    // Load giỏ hàng từ localStorage hoặc API tùy trạng thái đăng nhập
    useEffect(() => {
        if (authLoading) return;

        const fetchCart = async () => {
            setLoading(true)
            if (user) {
                // Đồng bộ từ DB
                const res = await cartService.getCart()
                if (res.success && res.raw.data) {
                    // Gộp giỏ hàng local lên server nếu có
                    const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
                    if (localCart.length > 0) {
                        localStorage.removeItem('cart')
                        for (const item of localCart) {
                            const res = await cartService.addToCart(item.id, item.qty)
                            if (!res.success) {
                                console.error('Thêm sản phẩm vào giỏ hàng thất bại', item.name, 'với lỗi:', res.message)
                            }
                        }
                        mergingRef.current = false

                        // Lấy lại giỏ hàng sau khi merge
                        const updatedRes = await cartService.getCart()
                        if (updatedRes.success && updatedRes.raw.data) {
                            const newItems = updatedRes.raw.data.ChiTietGioHang?.map(ct => ({
                                id: ct.sanpham_id,
                                giohang_id: updatedRes.raw.data.giohang_id,
                                name: ct.SanPham?.name,
                                price: ct.dongia,
                                image: ct.SanPham?.HinhAnhSanPhams?.[0]?.image_url || ct.SanPham?.image || null,
                                soluong: ct.SanPham?.soluongton || ct.SanPham?.soluong || 100,
                                qty: ct.soluong
                            })) || []
                            setItems(newItems)
                            syncConfirmedQty(newItems)
                        }
                    } else if (!mergingRef.current) {
                        const newItems = res.raw.data.ChiTietGioHang?.map(ct => ({
                            id: ct.sanpham_id,
                            giohang_id: res.raw.data.giohang_id,
                            name: ct.SanPham?.name,
                            price: ct.dongia,
                            image: ct.SanPham?.HinhAnhSanPhams?.[0]?.image_url || ct.SanPham?.image || null,
                            soluong: ct.SanPham?.soluongton || ct.SanPham?.soluong || 100,
                            qty: ct.soluong
                        })) || []
                        setItems(newItems)
                        syncConfirmedQty(newItems)
                    }
                }
            } else {
                // Lấy từ localStorage
                try {
                    const local = JSON.parse(localStorage.getItem('cart')) || []
                    setItems(local)
                    syncConfirmedQty(local)
                } catch {
                    setItems([])
                }
            }
            setLoading(false)
        }
        fetchCart()
    }, [user, authLoading, syncConfirmedQty])

    // Lắng nghe thay đổi của items để lưu localStorage nếu CHƯA đăng nhập
    useEffect(() => {
        if (!user && !authLoading) {
            localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, user, authLoading])

    const addCart = useCallback(async (product, qty = 1) => {
        const price = resolvePrice(product)
        if (user) {
            const res = await cartService.addToCart(product.id, qty)
            if (res.success) {
                // Cập nhật state local để UI phản hồi nhanh
                setItems(prev => {
                    const exist = prev.find(i => i.id === product.id)
                    const next = exist
                        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
                        : [...prev, {
                            id: product.id,
                            name: product.name,
                            price,
                            image: product.coverUrl || product.imageUrl || product.image || null,
                            soluong: product.soluong,
                            qty
                        }]
                    syncConfirmedQty(next)
                    return next
                })
            } else {
                toast.error(res.message || 'Lỗi thêm vào giỏ hàng')
            }
            return res
        } else {
            setItems(prev => {
                const exist = prev.find(i => i.id === product.id)
                const next = exist
                    ? prev.map(i =>
                        i.id === product.id
                            ? { ...i, qty: Math.min(i.qty + qty, product.soluong || 100) }
                            : i
                    )
                    : [...prev, {
                        id: product.id,
                        name: product.name,
                        price: product.gia,
                        image: product.imageUrl || product.image || null,
                        soluong: product.soluong,
                        qty,
                    }]
                syncConfirmedQty(next)
                return next
            })
            return { success: true }
        }
    }, [user])

    const removeFromCart = useCallback(async (id) => {
        if (user) {
            const res = await cartService.removeProduct(id)
            if (res.success) {
                setItems(prev => prev.filter(i => i.id !== id))
                delete confirmedQtyRef.current[id]
            }
        } else {
            setItems(prev => prev.filter(i => i.id !== id))
            delete confirmedQtyRef.current[id]
        }
    }, [user])

    const updateQty = useCallback((id, qty) => {
        if (qty <= 0) return removeFromCart(id)
        let isExceeded = false

        setItems(prev => {
            return prev.map(i => {
                if (i.id === id) {
                    const limit = i.soluong || 100
                    if (qty > limit) {
                        isExceeded = true
                        return i // Vượt tồn kho -> giữ nguyên không đổi
                    }
                    return { ...i, qty } // Cập nhật số mới ngay lập tức
                }
                return i
            })
        })
        // Nếu vượt tồn kho nội bộ thì báo Toast ngay, không cần gọi API
        if (isExceeded) {
            toast.error('Số lượng vượt quá tồn kho')
            return { success: false }
        }
        // 2. KHI ĐÃ ĐĂNG NHẬP: GỌI API BACKEND KÈM DEBOUNCE 
        if (user) {
            // Xóa bộ đếm cũ nếu user đang bấm liên tục
            if (updateTimeoutRef.current[id]) {
                clearTimeout(updateTimeoutRef.current[id])
            }
            // Đặt bộ đếm mới: Chỉ gửi API nếu sau 400ms user không bấm thêm
            updateTimeoutRef.current[id] = setTimeout(async () => {
                const res = await cartService.updateQuantity(id, qty)

                if (res.success) {
                    // Server đã xác nhận số lượng này -> cập nhật mốc "sự thật" để rollback đúng lần sau
                    confirmedQtyRef.current[id] = qty
                } else {
                    // Rollback về số lượng ĐÃ XÁC NHẬN với server gần nhất,
                    // không dùng state tạm ngay trước click cuối (tránh chỉ lùi 1 số khi bấm nhanh)
                    const qtyDaXacNhan = confirmedQtyRef.current[id]
                    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: qtyDaXacNhan } : i))
                    toast.error(res.message || 'Lỗi đồng bộ giỏ hàng')
                }
            }, 400)
        } else {
            // Khách chưa đăng nhập: không có server để xác nhận, coi state hiện tại là "đã xác nhận"
            confirmedQtyRef.current[id] = qty
        }
        return { success: true }
    }, [user, removeFromCart])

    const clearCart = useCallback(async () => {
        if (user) {
            // Tạm thời loop xóa từng sản phẩm vì chưa có API xóa nguyên giỏ
            for (const item of items) {
                await cartService.removeProduct(item.id)
            }
            setItems([])
            confirmedQtyRef.current = {}
        } else {
            setItems([])
            confirmedQtyRef.current = {}
            localStorage.removeItem('cart')
        }
    }, [user, items])

    const refreshCart = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const res = await cartService.getCart();
        if (res.success && res.raw.data) {
            const newItems = res.raw.data.chi_tiet_gio_hangs?.map(ct => ({
                id: ct.sanpham_id,
                giohang_id: res.raw.data.giohang_id,
                name: ct.SanPham?.name,
                price: ct.dongia,
                image: ct.SanPham?.HinhAnhSanPham?.[0]?.image_url || null,
                soluong: ct.SanPham?.soluong || 100,
                qty: ct.soluong
            })) || [];
            setItems(newItems);
            syncConfirmedQty(newItems)
        }
        setLoading(false);
    }, [user, syncConfirmedQty]);

    const totalItems = items.length
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)


    return (
        <CartContext.Provider value={{
            items, totalItems, totalPrice,
            isCartOpen, setIsCartOpen, loading,
            addCart, removeFromCart, updateQty, clearCart, refreshCart
        }}>
            {children}
        </CartContext.Provider>
    )
}
