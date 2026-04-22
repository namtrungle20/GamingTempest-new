import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useCart from '@/hook/useCart'

const PaymentReturnPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { refreshCart } = useCart()
    const [status, setStatus] = useState('loading') // loading, success, error

    useEffect(() => {
        const resultCode = searchParams.get('resultCode')
        const message = searchParams.get('message')
        // MoMo thường trả về resultCode = 0 là thành công
        if (resultCode === '0') {
            setStatus('success')
            refreshCart() // làm mới giỏ hàng (sẽ trống)
        } else {
            setStatus('error')
        }
    }, [searchParams, refreshCart])

    if (status === 'loading') {
        return (
            <Mui.Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Mui.CircularProgress />
            </Mui.Box>
        )
    }

    if (status === 'success') {
        return (
            <Mui.Box textAlign="center" py={10}>
                <Icon.CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Mui.Typography variant="h4" fontWeight={800} gutterBottom>Thanh toán thành công!</Mui.Typography>
                <Mui.Typography variant="body1" color="text.secondary" paragraph>
                    Cảm ơn bạn đã mua sắm. Đơn hàng đang được xử lý.
                </Mui.Typography>
                <Mui.Button variant="contained" onClick={() => navigate('/')}>Về trang chủ</Mui.Button>
            </Mui.Box>
        )
    }

    return (
        <Mui.Box textAlign="center" py={10}>
            <Icon.Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Mui.Typography variant="h4" fontWeight={800} gutterBottom>Thanh toán thất bại</Mui.Typography>
            <Mui.Typography variant="body1" color="text.secondary" paragraph>
                Đã có lỗi xảy ra. Vui lòng thử lại.
            </Mui.Typography>
            <Mui.Button variant="contained" onClick={() => navigate('/cart')}>Quay lại giỏ hàng</Mui.Button>
        </Mui.Box>
    )
}

export default PaymentReturnPage