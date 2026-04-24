// components/CheckoutButton.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { cartService } from '@/services/cart.service'

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

    const handleCheckout = async () => {
        if (!diachi || !sdt) return
        setLoading(true)
        setError(null)

        // Bước 1: Lấy giohang_id
        const cartRes = await cartService.getCart()
        if (!cartRes.success || !cartRes.raw?.data?.giohang_id) {
            setError('Không tìm thấy giỏ hàng. Vui lòng thử lại.')
            setLoading(false)
            return
        }
        // const giohang_id = cartRes.raw.data.giohang_id

        // Bước 2: Checkout — backend tạo đơn hàng + payUrl (nếu MoMo)
        const checkoutRes = await cartService.checkout(diachi, sdt, Number(phuongThuc))
        setLoading(false)

        if (!checkoutRes.success) {
            setError(checkoutRes.message || 'Đặt hàng thất bại')
            return
        }

        const { payUrl } = checkoutRes.raw?.data || {}

        if (phuongThuc === 1) {
            // MoMo: redirect sang cổng thanh toán
            if (payUrl) {
                window.location.href = payUrl
            } else {
                setError('Không lấy được link thanh toán MoMo')
            }
        } else {
            // COD: thành công ngay
            if (onSuccess) onSuccess()
            else navigate('/')
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