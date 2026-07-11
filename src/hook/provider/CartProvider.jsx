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
                        // console.log('=== BẮT ĐẦU MERGE ===', localCart)
                        for (const item of localCart) {
                            const res = await cartService.addToCart(item.id, item.qty)
                            if (!res.success) {
                                console.error('Thêm sản phẩm vào giỏ hàng thất bại', item.name, 'với lỗi:', res.message)
                            }
                        }
                        mergingRef.current = false

                        // Lấy lại giỏ hàng sau khi merge
                        const updatedRes = await cartService.getCart()
                        // console.log('=== KẾT QUẢ getCart SAU MERGE ===', updatedRes)
                        if (updatedRes.success && updatedRes.raw.data) {
                            setItems(updatedRes.raw.data.ChiTietGioHang?.map(ct => ({
                                id: ct.sanpham_id,
                                giohang_id: updatedRes.raw.data.giohang_id,
                                name: ct.SanPham?.name,
                                price: ct.dongia,
                                image: ct.SanPham?.HinhAnhSanPhams?.[0]?.image_url || ct.SanPham?.image || null,
                                soluong: ct.SanPham?.soluongton || ct.SanPham?.soluong || 100,
                                qty: ct.soluong
                            })) || [])
                        }
                    } else if (!mergingRef.current) {
                        setItems(res.raw.data.ChiTietGioHang?.map(ct => ({
                            id: ct.sanpham_id,
                            giohang_id: res.raw.data.giohang_id,
                            name: ct.SanPham?.name,
                            price: ct.dongia,
                            image: ct.SanPham?.HinhAnhSanPhams?.[0]?.image_url || ct.SanPham?.image || null,
                            soluong: ct.SanPham?.soluongton || ct.SanPham?.soluong || 100,
                            qty: ct.soluong
                        })) || [])
                    }
                }
            } else {
                // Lấy từ localStorage
                try {
                    const local = JSON.parse(localStorage.getItem('cart')) || []
                    setItems(local)
                } catch {
                    setItems([])
                }
            }
            setLoading(false)
        }
        fetchCart()
    }, [user, authLoading])

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
                    if (exist) {
                        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
                    }
                    return [...prev, {
                        id: product.id,
                        name: product.name,
                        price,
                        image: product.coverUrl || product.imageUrl || product.image || null,
                        soluong: product.soluong,
                        qty
                    }]
                })
            }
            return res
        } else {
            setItems(prev => {
                const exist = prev.find(i => i.id === product.id)
                if (exist) {
                    return prev.map(i =>
                        i.id === product.id
                            ? { ...i, qty: Math.min(i.qty + qty, product.soluong || 100) }
                            : i
                    )
                }
                return [...prev, {
                    id: product.id,
                    name: product.name,
                    price: product.gia,
                    image: product.imageUrl || product.image || null,
                    soluong: product.soluong,
                    qty,
                }]
            })
            return { success: true }
        }
    }, [user])

    const removeFromCart = useCallback(async (id) => {
        if (user) {
            const res = await cartService.removeProduct(id)
            if (res.success) {
                setItems(prev => prev.filter(i => i.id !== id))
            }
        } else {
            setItems(prev => prev.filter(i => i.id !== id))
        }
    }, [user])

    const updateQty = useCallback((id, qty) => {
        if (qty <= 0) return removeFromCart(id)
        let isExceeded = false
        let oldItems = []
        // 1. OPTIMISTIC UPDATE: Cập nhật UI ngay lập tức để tạo độ mượt
        setItems(prev => {
            oldItems = prev // Lưu lại trạng thái cũ phòng khi API lỗi
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

                // Nếu Backend báo lỗi (ví dụ: kho vừa hết hàng), Rollback về số cũ
                if (!res.success) {
                    setItems(oldItems)
                    toast.error(res.message || 'Lỗi đồng bộ giỏ hàng')
                }
            }, 400)
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
        } else {
            setItems([])
            localStorage.removeItem('cart')
        }
    }, [user, items])

    const refreshCart = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const res = await cartService.getCart();
        if (res.success && res.raw.data) {
            // Cập nhật state items giống như trong useEffect
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
        }
        setLoading(false);
    }, [user]);

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
