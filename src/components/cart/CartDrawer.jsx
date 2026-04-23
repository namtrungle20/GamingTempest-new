import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hook/provider/CartProvider'
import useAuth from '@/hook/useAuth'
import LoginModal from '@/components/auth/LoginModal'
import CartItem from './CartItem'

const CartDrawer = () => {
    const navigate = useNavigate()
    const { user, login, loading: authLoading, error: authError } = useAuth()
    const { items, totalPrice, totalItems, updateQty, removeFromCart, loading, isCartOpen, setIsCartOpen } = useCart()
    const [loginModalOpen, setLoginModalOpen] = useState(false)

    const handleCheckout = () => {
        if (!user) {
            setLoginModalOpen(true)
            return
        }
        setIsCartOpen(false)
        navigate('/checkout')
    }

    return (
        <>
            <Mui.Drawer
                anchor="right"
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } }}
            >
                {/* ... header ... */}
                <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Mui.Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon.ShoppingBagOutlined /> Giỏ hàng ({totalItems})
                    </Mui.Typography>
                    <Mui.IconButton onClick={() => setIsCartOpen(false)}>
                        <Icon.Close />
                    </Mui.IconButton>
                </Mui.Box>

                {/* ... body (giống cũ) ... */}
                <Mui.Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    {loading ? (
                        <Mui.Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <Mui.CircularProgress />
                        </Mui.Box>
                    ) : items.length === 0 ? (
                        <Mui.Box sx={{ textAlign: 'center', py: 8 }}>
                            <Icon.ShoppingCartOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Mui.Typography variant="body1" color="text.secondary">
                                Giỏ hàng của bạn đang trống
                            </Mui.Typography>
                            <Mui.Button
                                variant="contained"
                                sx={{ mt: 3, borderRadius: 2 }}
                                onClick={() => {
                                    setIsCartOpen(false)
                                    navigate('/products')
                                }}
                            >
                                Tiếp tục mua sắm
                            </Mui.Button>
                        </Mui.Box>
                    ) : (
                        items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQty={updateQty}
                                onRemove={removeFromCart}
                            />
                        ))
                    )}
                </Mui.Box>

                {items.length > 0 && (
                    <Mui.Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Mui.Typography variant="subtitle1" fontWeight={600}>Tổng cộng:</Mui.Typography>
                            <Mui.Typography variant="h6" color="primary.main" fontWeight={700}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </Mui.Typography>
                        </Mui.Box>
                        <Mui.Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', py: 1.5 }}
                            onClick={handleCheckout}
                        >
                            Tiến hành thanh toán
                        </Mui.Button>
                    </Mui.Box>
                )}
            </Mui.Drawer>

            {/* Login Modal */}
            <LoginModal
                open={loginModalOpen}
                handleClose={() => setLoginModalOpen(false)}
                onSwitchRegister={() => {
                    setLoginModalOpen(false)
                    // Mở register modal nếu muốn
                }}
                login={login}
                loading={authLoading}
                error={authError}
            />
        </>
    )
}

export default CartDrawer