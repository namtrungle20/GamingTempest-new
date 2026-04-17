// src/hook/provider/CartProvider.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart phải dùng trong CartProvider')
    return ctx
}

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart')) || []
        } catch {
            return []
        }
    })

    // Sync vào localStorage mỗi khi items thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    // Thêm sản phẩm — nếu đã có thì cộng số lượng
    const addToCart = useCallback((product, qty = 1) => {
        setItems(prev => {
            const exist = prev.find(i => i.id === product.id)
            if (exist) {
                return prev.map(i =>
                    i.id === product.id
                        ? { ...i, qty: Math.min(i.qty + qty, product.soluong) }
                        : i
                )
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.gia,       // số nguyên
                image: product.imageUrl || null,
                soluong: product.soluong,
                qty,
            }]
        })
    }, [])

    // Xóa 1 sản phẩm
    const removeFromCart = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }, [])

    // Cập nhật số lượng
    const updateQty = useCallback((id, qty) => {
        if (qty <= 0) return removeFromCart(id)
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
    }, [removeFromCart])

    // Xóa toàn bộ giỏ hàng
    const clearCart = useCallback(() => setItems([]), [])

    const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

    return (
        <CartContext.Provider value={{
            items, totalItems, totalPrice,
            addToCart, removeFromCart, updateQty, clearCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}
