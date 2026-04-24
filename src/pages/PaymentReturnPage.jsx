import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { thanhToanService } from '@/services/thanhtoan.service';
import { useCart } from '@/hook/provider/CartProvider';

const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const verifyReturn = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                const result = await thanhToanService.verifyReturn(params);
                if (result.success && result.data?.resultCode === 0) {
                    setStatus('success');
                    clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
                } else {
                    setStatus('fail');
                    setErrorMsg(result.data?.message || 'Thanh toán thất bại');
                }
            } catch {
                setStatus('fail');
                setErrorMsg('Lỗi kết nối, vui lòng thử lại sau');
            }
        };
        verifyReturn();
    }, [searchParams, clearCart]);

    if (status === 'loading') {
        return (
            <Mui.Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                <Mui.CircularProgress />
                <Mui.Typography sx={{ mt: 2 }}>Đang xác nhận thanh toán...</Mui.Typography>
            </Mui.Box>
        );
    }

    return (
        <Mui.Box textAlign="center" py={10}>
            {status === 'success' ? (
                <>
                    <Icon.CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Mui.Typography variant="h4" fontWeight={800} gutterBottom>
                        Thanh toán thành công!
                    </Mui.Typography>
                    <Mui.Typography variant="body1" color="text.secondary" paragraph>
                        Cảm ơn bạn đã mua sắm. Đơn hàng đang được xử lý.
                    </Mui.Typography>
                    <Mui.Button variant="contained" onClick={() => navigate('/don-hang')}>
                        Xem đơn hàng
                    </Mui.Button>
                </>
            ) : (
                <>
                    <Icon.Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    <Mui.Typography variant="h4" fontWeight={800} gutterBottom>
                        Thanh toán thất bại
                    </Mui.Typography>
                    <Mui.Typography variant="body1" color="text.secondary" paragraph>
                        {errorMsg || 'Giao dịch không thành công hoặc đã bị hủy.'}
                    </Mui.Typography>
                    <Mui.Button variant="contained" onClick={() => navigate('/gio-hang')}>
                        Quay lại giỏ hàng
                    </Mui.Button>
                </>
            )}
        </Mui.Box>
    );
};

export default PaymentReturnPage;