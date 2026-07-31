// components/CheckoutButton.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { cartService } from '@/services/cart.service'
import { toast } from 'sonner'

/**
 * Props:
 *  - diachi: string
 *  - sdt: string
 *  - phuongThuc: number (0: COD, 1: MoMo)
 *  - onSuccess: () => void — callback khi COD thành công
 */
const CheckoutButton = ({ diachi, sdt, phuongThuc, onSuccess }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    const handleCheckout = async () => {
        if (!diachi || !sdt || submitted) return
        setSubmitted(true)
        setLoading(true)
        setError(null)

        // Bước 2: Checkout — backend tạo đơn hàng + payUrl (nếu MoMo)
        const checkoutRes = await cartService.checkout(diachi, sdt, Number(phuongThuc))
        setLoading(false)

        if (!checkoutRes.success) {
            if (checkoutRes.message?.includes('Giỏ hàng không tồn tại')) {
                toast.info('Đơn hàng của bạn đã được ghi nhận trước đó.')
                navigate('/donhang')
                return
            }
            setError(checkoutRes.message || 'Đặt hàng thất bại')
            setSubmitted(false)
            return
        }

        const { payUrl } = checkoutRes.raw?.data || {}

        if (phuongThuc === 1) {
            if (payUrl) {
                toast.success('Đang chuyển đến cổng thanh toán MoMo...')
                window.location.href = payUrl

            } else {
                setError('Không lấy được link thanh toán MoMo')
                setSubmitted(false)
            }
        } else {
            toast.success('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.')
            if (onSuccess) onSuccess(checkoutRes.raw?.data)
            else navigate('/donhang')
        }
    }

    return (
        <Mui.Box>
            <Mui.Button
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !diachi || !sdt}
                onClick={handleCheckout}
                startIcon={
                    loading
                        ? <Mui.CircularProgress size={20} color="inherit" />
                        : <Icon.Payment />
                }
                sx={{ py: 1.5, fontWeight: 700, textTransform: 'none' }}
            >
                {loading
                    ? 'Đang xử lý...'
                    : phuongThuc === 1
                        ? 'Thanh toán MoMo'
                        : 'Xác nhận đặt hàng (COD)'
                }
            </Mui.Button>

            {error && (
                <Mui.Alert severity="error" sx={{ mt: 1.5 }}>
                    {error}
                </Mui.Alert>
            )}
        </Mui.Box>
    )
}

export default CheckoutButton