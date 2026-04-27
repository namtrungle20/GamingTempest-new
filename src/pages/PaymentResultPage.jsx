import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const PaymentResultPage = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    const isSuccess = params.get('isSuccess') === 'true'
    const message = params.get('message')
    const amount = Number(params.get('amount'))
    const orderId = params.get('orderId')

    const amountFormatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND'
    }).format(amount)

    return (
        <Mui.Container maxWidth="sm" sx={{
            py: 8,
        }}>
            <Mui.Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}>
                {isSuccess ? (
                    <Icon.CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                ) : (
                    <Icon.Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                )}

                <Mui.Typography variant="h5" fontWeight={700} mb={1}>
                    {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </Mui.Typography>

                <Mui.Typography color="text.secondary" mb={3}>
                    {message}
                </Mui.Typography>

                {isSuccess && (
                    <Mui.Stack spacing={1} mb={3} sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                        <Mui.Stack direction="row" justifyContent="space-between">
                            <Mui.Typography variant="body2" color="text.secondary">Số tiền</Mui.Typography>
                            <Mui.Typography variant="body2" fontWeight={700} color="success.main">
                                {amountFormatted}
                            </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack direction="row" justifyContent="space-between">
                            <Mui.Typography variant="body2" color="text.secondary">Mã giao dịch</Mui.Typography>
                            <Mui.Typography variant="body2" fontWeight={600}>
                                {orderId?.slice(0, 8).toUpperCase()}
                            </Mui.Typography>
                        </Mui.Stack>
                    </Mui.Stack>
                )}

                <Mui.Stack direction="row" spacing={2} justifyContent="center">
                    <Mui.Button
                        variant="outlined"
                        onClick={() => navigate('/donhang')}
                        startIcon={<Icon.Receipt />}
                    >
                        Xem đơn hàng
                    </Mui.Button>
                    <Mui.Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        startIcon={<Icon.Home />}
                    >
                        Về trang chủ
                    </Mui.Button>
                </Mui.Stack>
            </Mui.Card>
        </Mui.Container>
    )
}

export default PaymentResultPage