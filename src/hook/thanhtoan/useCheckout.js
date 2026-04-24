// hooks/useCheckout.js
import { useState } from 'react';
import { thanhToanService } from '@/services/thanhtoan.service';

const useCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkout = async (payload) => {
        setLoading(true);
        setError(null);

        const result = await thanhToanService.create(payload);

        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return null;
        }

        const data = result.raw?.data;

        // Nếu MoMo: redirect sang cổng thanh toán
        if (data?.pay_url) {
            window.location.href = data.pay_url;
            return data;
        }

        // Nếu COD: trả data về để page xử lý tiếp
        return data;
    };

    return { checkout, loading, error };
};

export default useCheckout;