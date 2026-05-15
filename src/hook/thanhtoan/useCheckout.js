// hooks/useCheckout.js
import { useState } from 'react';
import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

const useCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkout = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            // ✅ Gọi đúng endpoint /giohang/me/thanhtoan
            const response = await apiConfig.post(API.GIOHANG.CHECKOUT, payload);
            const data = response.data?.data;

            if (data?.pay_url) {
                window.location.href = data.pay_url;
                return data;
            }

            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi thanh toán');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { checkout, loading, error };
};

export default useCheckout;