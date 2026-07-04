// pages/CheckOutPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import { toast } from 'sonner'
import * as Mui from '@mui/material'
import { useCart } from '@/hook/provider/CartProvider'
import { useAuth } from '@/hook/provider/AuthContext'
import LoginModal from '@/components/auth/LoginModal'
import CheckoutButton from '@/components/payment/CheckoutButton'
// import useDanhGia from '@/hook/product/useDanhGia'
// import DanhGiaModal from '@/components/admin/product/DanhGiaModal'
import * as Icon from '@mui/icons-material'
import useMemberRank from '@/hook/user/useMemberRank'

const PHI_SHIP_GOC = 30000

const CheckOutPage = () => {
    const COD_MAX_AMOUNT = 5000000
    const navigate = useNavigate()
    const { user, login, loading: authLoading, error: authError } = useAuth()
    const { items, totalPrice, clearCart } = useCart()
    const { giam_ship, label, loading: hangLoading } = useMemberRank(!!user)

    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        diachi: '',
        sdt: '',
        phuongthucthanhtoan: 0 // 0: COD, 1: MoMo
    })
    const [reviewQueue, setReviewQueue] = useState([])
    const [reviewIndex, setReviewIndex] = useState(0)
    const [reviewOpen, setReviewOpen] = useState(false)
    const codDisabled = totalPrice > COD_MAX_AMOUNT

    const currentReviewProduct = reviewQueue[reviewIndex] || null
    // const { submitReview } = useDanhGia(currentReviewProduct?.id)

    useEffect(() => {
        if (codDisabled && formData.phuongthucthanhtoan === 0) {
            setFormData(prev => ({ ...prev, phuongthucthanhtoan: 1 }))
        }
    }, [codDisabled])

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

    const handleCODSuccess = async (data) => {
        const { donHang } = data || {}
        if (!donHang) {
            toast.error('Không nhận được thông tin đơn hàng')
            return
        }
        // const { tongtien, phi_van_chuyen } = donHang

        const boughtItems = [...items]
        await clearCart()

        setReviewQueue(boughtItems)
        setReviewIndex(0)
        setReviewOpen(true)

        //     toast.success(`Đặt hàng thành công! Tổng tiền: ${tongtien.toLocaleString('vi-VN')}đ (đã gồm ${phi_van_chuyen.toLocaleString('vi-VN')}đ phí ship)`)
    }
    const handleReviewClose = () => {
        // Chuyển sang sản phẩm tiếp theo hoặc đóng hẳn
        if (reviewIndex < reviewQueue.length - 1) {
            setReviewIndex(i => i + 1)
        } else {
            setReviewOpen(false)
            navigate('/')
        }
    }

    // const handleReviewSubmit = async ({ sosao, binhluan }) => {
    //     const ok = await submitReview({ sosao, binhluan })
    //     if (ok) handleReviewClose()
    //     return ok
    // }

    if (items.length === 0 && !reviewOpen && reviewQueue.length === 0) {
        return (
            <Mui.Box textAlign="center" py={10}>
                <Mui.Typography variant="h6">Giỏ hàng trống</Mui.Typography>
                <Mui.Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Về trang chủ</Mui.Button>
            </Mui.Box>
        )
    }

    const shipping = hangLoading
        ? PHI_SHIP_GOC
        : Math.round(PHI_SHIP_GOC * (1 - giam_ship / 100))
    const soTienDuocGiam = PHI_SHIP_GOC - shipping
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
                                    <Mui.FormControlLabel
                                        value={0}
                                        control={<Mui.Radio />}
                                        label="Thanh toán khi nhận hàng (COD)"
                                        disabled={codDisabled}
                                    />
                                    <Mui.FormControlLabel value={1} control={<Mui.Radio />} label="Thanh toán qua MoMo" />
                                </Mui.RadioGroup>
                                {codDisabled && (
                                    <Mui.Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
                                        Đơn hàng trên {COD_MAX_AMOUNT.toLocaleString('vi-VN')}đ chỉ hỗ trợ thanh toán qua MoMo để đảm bảo an toàn giao dịch.
                                    </Mui.Alert>
                                )}
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
                            <Mui.Box sx={{ mt: 1 }}>
                                <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Mui.Typography variant="body2">Phí vận chuyển:</Mui.Typography>
                                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {soTienDuocGiam > 0 && (
                                            <Mui.Typography
                                                variant="body2"
                                                sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                                            >
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(PHI_SHIP_GOC)}
                                            </Mui.Typography>
                                        )}
                                        <Mui.Typography variant="body2" fontWeight={600}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping)}
                                        </Mui.Typography>
                                    </Mui.Box>
                                </Mui.Box>

                                {soTienDuocGiam > 0 && !hangLoading && (
                                    <Mui.Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                                        <Mui.Chip
                                            size="small"
                                            icon={<Icon.LocalOffer sx={{ fontSize: '13px !important' }} />}
                                            label={`Giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTienDuocGiam)} nhờ hạng ${label}`}
                                            color="success"
                                            variant="outlined"
                                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                                        />
                                    </Mui.Box>
                                )}
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
            {currentReviewProduct && (
                <Mui.Dialog open={reviewOpen} onClose={handleReviewClose} maxWidth="sm" fullWidth>
                    <Mui.DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Mui.Box>
                            <Mui.Typography fontWeight={800}>Đánh giá sản phẩm</Mui.Typography>
                            {reviewQueue.length > 1 && (
                                <Mui.Typography variant="caption" color="text.secondary">
                                    {reviewIndex + 1} / {reviewQueue.length} sản phẩm
                                </Mui.Typography>
                            )}
                        </Mui.Box>
                        <Mui.IconButton onClick={handleReviewClose}>
                            <Icon.Close />
                        </Mui.IconButton>
                    </Mui.DialogTitle>

                    <Mui.DialogContent>
                        {/* Cảm ơn + thông tin sản phẩm */}
                        <Mui.Box
                            display="flex" flexDirection="column" alignItems="center"
                            textAlign="center" py={2} gap={1.5}
                        >
                            <Icon.FavoriteOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Mui.Typography variant="h6" fontWeight={800}>
                                Cảm ơn bạn đã mua hàng!
                            </Mui.Typography>
                            <Mui.Typography variant="body2" color="text.secondary">
                                Hãy để lại đánh giá để giúp những khách hàng khác nhé.
                            </Mui.Typography>
                        </Mui.Box>

                        {/* Thông tin sản phẩm — click để xem chi tiết */}
                        <Mui.Box
                            component={RouterLink}
                            to={`/products/${currentReviewProduct.id}`}
                            onClick={handleReviewClose}
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1.5,
                                p: 1.5, bgcolor: 'action.hover', borderRadius: 2,
                                textDecoration: 'none', color: 'inherit', mb: 2,
                                border: '1px solid', borderColor: 'divider',
                                transition: 'all 0.15s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' }
                            }}
                        >
                            {currentReviewProduct.image && (
                                <Mui.Avatar
                                    src={currentReviewProduct.image}
                                    variant="rounded"
                                    sx={{ width: 52, height: 52 }}
                                />
                            )}
                            <Mui.Box flex={1}>
                                <Mui.Typography variant="body2" fontWeight={700}>
                                    {currentReviewProduct.name}
                                </Mui.Typography>
                                <Mui.Typography variant="caption" color="primary.main" fontWeight={600}>
                                    Xem chi tiết sản phẩm →
                                </Mui.Typography>
                            </Mui.Box>
                            <Icon.ChevronRight color="action" />
                        </Mui.Box>
                    </Mui.DialogContent>
                    {/* <DanhGiaModal
                        open={reviewOpen}
                        onClose={handleReviewClose}
                        onSubmit={handleReviewSubmit}
                        submitting={submitting}
                        submitError={submitError}
                        setSubmitError={setSubmitError}
                    /> */}
                </Mui.Dialog>
            )}
        </>
    )
}

export default CheckOutPage