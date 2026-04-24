// pages/CheckOutPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import { useCart } from '@/hook/provider/CartProvider'
import useAuth from '@/hook/useAuth'
import LoginModal from '@/components/auth/LoginModal'
import CheckoutButton from '@/components/payment/CheckoutButton'

const CheckOutPage = () => {
    const navigate = useNavigate()
    const { user, login, loading: authLoading, error: authError } = useAuth()
    const { items, totalPrice, clearCart } = useCart()
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        diachi: '',
        sdt: '',
        phuongthucthanhtoan: 0 // 0: COD, 1: MoMo
    })

    useEffect(() => {
        if (!user && !authLoading) setLoginModalOpen(true)
        else setLoginModalOpen(false)
    }, [user, authLoading])

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                sdt: user.sdt || user.phone || '',
                diachi: user.diachi || user.address || ''
            }))
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'sdt' && user && (user.sdt || user.phone)) return
        setFormData(prev => ({
            ...prev,
            [name]: name === 'phuongthucthanhtoan' ? Number(value) : value
        }))
    }

    const handleCODSuccess = async () => {
        await clearCart()
        alert('Đặt hàng thành công!')
        navigate('/')
    }

    if (items.length === 0) {
        return (
            <Mui.Box textAlign="center" py={10}>
                <Mui.Typography variant="h6">Giỏ hàng trống</Mui.Typography>
                <Mui.Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Về trang chủ</Mui.Button>
            </Mui.Box>
        )
    }

    const shipping = 0
    const finalTotal = totalPrice + shipping

    return (
        <>
            <Mui.Container maxWidth="lg" sx={{ py: 4 }}>
                <Mui.Typography variant="h4" fontWeight={800} gutterBottom>Thanh toán</Mui.Typography>
                <Mui.Grid container spacing={4}>
                    {/* LEFT — Form */}
                    <Mui.Grid item xs={12} md={7}>
                        <Mui.Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Mui.Typography variant="h6" fontWeight={700} gutterBottom>Thông tin nhận hàng</Mui.Typography>

                            <Mui.TextField
                                fullWidth label="Địa chỉ" name="diachi"
                                value={formData.diachi} onChange={handleChange}
                                required margin="normal"
                            />
                            <Mui.TextField
                                fullWidth label="Số điện thoại" name="sdt"
                                value={formData.sdt} onChange={handleChange}
                                required margin="normal"
                                disabled={!!user && !!(user.sdt || user.phone)}
                                helperText={user && (user.sdt || user.phone) ? 'Số điện thoại được lấy từ tài khoản, không thể thay đổi' : ''}
                            />

                            <Mui.Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                                Phương thức thanh toán
                            </Mui.Typography>
                            <Mui.FormControl component="fieldset">
                                <Mui.RadioGroup
                                    name="phuongthucthanhtoan"
                                    value={formData.phuongthucthanhtoan}
                                    onChange={handleChange}
                                >
                                    <Mui.FormControlLabel value={0} control={<Mui.Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                    <Mui.FormControlLabel value={1} control={<Mui.Radio />} label="Thanh toán qua MoMo" />
                                </Mui.RadioGroup>
                            </Mui.FormControl>

                            <Mui.Box sx={{ mt: 3 }}>
                                <CheckoutButton
                                    diachi={formData.diachi}
                                    sdt={formData.sdt}
                                    phuongThuc={formData.phuongthucthanhtoan}
                                    onSuccess={handleCODSuccess}
                                />
                            </Mui.Box>
                        </Mui.Paper>
                    </Mui.Grid>

                    {/* RIGHT — Order summary */}
                    <Mui.Grid item xs={12} md={5}>
                        <Mui.Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'sticky', top: 20 }}>
                            <Mui.Typography variant="h6" fontWeight={700} gutterBottom>Đơn hàng của bạn</Mui.Typography>
                            <Mui.Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                                {items.map(item => (
                                    <Mui.Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Mui.Typography variant="body2">{item.name} x {item.qty}</Mui.Typography>
                                        <Mui.Typography variant="body2" fontWeight={600}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.qty)}
                                        </Mui.Typography>
                                    </Mui.Box>
                                ))}
                            </Mui.Box>
                            <Mui.Divider />
                            <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Mui.Typography variant="subtitle1" fontWeight={700}>Tạm tính:</Mui.Typography>
                                <Mui.Typography variant="subtitle1" fontWeight={600}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </Mui.Typography>
                            </Mui.Box>
                            <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Mui.Typography variant="body2">Phí vận chuyển:</Mui.Typography>
                                <Mui.Typography variant="body2" fontWeight={600}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping)}
                                </Mui.Typography>
                            </Mui.Box>
                            <Mui.Divider sx={{ my: 2 }} />
                            <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Mui.Typography variant="subtitle1" fontWeight={700}>Tổng cộng:</Mui.Typography>
                                <Mui.Typography variant="subtitle1" color="primary.main" fontWeight={800}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}
                                </Mui.Typography>
                            </Mui.Box>
                        </Mui.Paper>
                    </Mui.Grid>
                </Mui.Grid>
            </Mui.Container>

            <LoginModal
                open={loginModalOpen}
                handleClose={() => setLoginModalOpen(false)}
                onSwitchRegister={() => setLoginModalOpen(false)}
                login={login}
                loading={authLoading}
                error={authError}
            />
        </>
    )
}

export default CheckOutPage