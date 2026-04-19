import { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hook/provider/CartProvider'
import useAuth from '@/hook/useAuth'
import { cartService } from '@/services/cart.service'
import { useProductCoverImage } from '@/hook/product/useProductCoverImage'

// TẠO COMPONENT CON NÀY ĐỂ GỌI HOOK CHO TỪNG SẢN PHẨM
const CheckoutItem = ({ item }) => {
    const imageUrl = useProductCoverImage(item.id)

    return (
        <Mui.Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Mui.Box
                component="img"
                src={imageUrl || 'https://via.placeholder.com/60?text=No+Image'}
                sx={{ width: 60, height: 60, objectFit: 'contain', bgcolor: 'background.default', borderRadius: 1 }}
            />
            <Mui.Box sx={{ flex: 1 }}>
                <Mui.Typography variant="body2" fontWeight={600} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name}
                </Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary">SL: {item.qty}</Mui.Typography>
            </Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.qty)}
            </Mui.Typography>
        </Mui.Box>
    )
}

const CheckoutPage = () => {
    const { items, totalPrice, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        sdt: user?.sdt || '',
        diachi: '',
        phuongthuc: 'COD'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (items.length === 0) return alert('Giỏ hàng trống!')

        setLoading(true)
        if (!user) {
            alert('Vui lòng đăng nhập để thanh toán')
            setLoading(false)
            return
        }

        const res = await cartService.checkout(form)
        setLoading(false)

        if (res.success) {
            alert('Đặt hàng thành công!')
            await clearCart()
            navigate('/')
        } else {
            alert(res.message || 'Có lỗi xảy ra khi đặt hàng')
        }
    }

    if (items.length === 0) {
        return (
            <Mui.Container sx={{ py: 8, textAlign: 'center' }}>
                <Mui.Typography variant="h5" mb={2}>Giỏ hàng của bạn đang trống</Mui.Typography>
                <Mui.Button variant="contained" onClick={() => navigate('/products')}>Mua sắm ngay</Mui.Button>
            </Mui.Container>
        )
    }
    // THÊM ĐOẠN NÀY ĐỂ CHẶN NGƯỜI DÙNG CHƯA ĐĂNG NHẬP
    if (!user) {
        return (
            <Mui.Container sx={{ py: 12, textAlign: 'center' }}>
                <Icon.LockOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Mui.Typography variant="h5" mb={2} fontWeight={700}>
                    Bạn chưa đăng nhập
                </Mui.Typography>
                <Mui.Typography variant="body1" color="text.secondary" mb={4}>
                    Vui lòng đăng nhập hoặc tạo tài khoản để có thể tiến hành thanh toán giỏ hàng của bạn.
                </Mui.Typography>
                {/* Chú ý: Vì form Login của bạn nằm trên Navbar, nên có thể hướng dẫn người dùng bấm vào Navbar */}
                <Mui.Typography variant="body2" color="primary.main" fontWeight={600}>
                    (Nhấn vào biểu tượng tài khoản ở góc trên bên phải để đăng nhập)
                </Mui.Typography>
            </Mui.Container>
        )
    }

    return (
        <Mui.Container maxWidth="lg" sx={{ py: 6 }}>
            <Mui.Typography variant="h4" fontWeight={800} mb={4}>Thanh toán</Mui.Typography>

            <Mui.Grid container spacing={4}>
                {/* Form thông tin giao hàng */}
                <Mui.Grid item xs={12} md={7}>
                    <Mui.Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Mui.Typography variant="h6" fontWeight={700} mb={3}>Thông tin giao hàng</Mui.Typography>
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <Mui.TextField
                                fullWidth label="Số điện thoại người nhận" required sx={{ mb: 3 }}
                                value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                            />
                            <Mui.TextField
                                fullWidth label="Địa chỉ giao hàng chi tiết" required multiline rows={3} sx={{ mb: 3 }}
                                value={form.diachi} onChange={(e) => setForm({ ...form, diachi: e.target.value })}
                            />
                            <Mui.Typography variant="subtitle2" fontWeight={600} mb={1}>Phương thức thanh toán</Mui.Typography>
                            <Mui.RadioGroup
                                value={form.phuongthuc}
                                onChange={(e) => setForm({ ...form, phuongthuc: e.target.value })}
                            >
                                <Mui.FormControlLabel value="COD" control={<Mui.Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                <Mui.FormControlLabel value="CHUYEN_KHOAN" control={<Mui.Radio />} label="Chuyển khoản ngân hàng" />
                            </Mui.RadioGroup>
                        </form>
                    </Mui.Paper>
                </Mui.Grid>

                {/* Tóm tắt đơn hàng */}
                <Mui.Grid item xs={12} md={5}>
                    <Mui.Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#16161a', border: '1px solid', borderColor: 'divider' }}>
                        <Mui.Typography variant="h6" fontWeight={700} mb={3}>Tóm tắt đơn hàng</Mui.Typography>

                        <Mui.Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 3 }}>
                            {/* GỌI COMPONENT CON Ở ĐÂY */}
                            {items.map(item => (
                                <CheckoutItem key={item.id} item={item} />
                            ))}
                        </Mui.Box>

                        <Mui.Divider sx={{ mb: 3 }} />
                        <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Mui.Typography variant="h6" fontWeight={500}>Tổng cộng:</Mui.Typography>
                            <Mui.Typography variant="h5" color="primary.main" fontWeight={800}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </Mui.Typography>
                        </Mui.Box>

                        <Mui.Button
                            type="submit" form="checkout-form"
                            variant="contained" fullWidth size="large"
                            disabled={loading}
                            sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2 }}
                            onClick={() => navigate("/404")}
                        >
                            {loading ? <Mui.CircularProgress size={24} color="inherit" /> : 'Đặt Hàng'}
                        </Mui.Button>
                    </Mui.Paper>
                </Mui.Grid>
            </Mui.Grid>
        </Mui.Container>
    )
}

export default CheckoutPage
