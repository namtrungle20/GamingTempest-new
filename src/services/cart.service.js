import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

export const cartService = {
    getCart: async () => {
        try {
            const response = await apiConfig.get(API.GIOHANG.ME);
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy giỏ hàng' };
        }
    },
    addToCart: async (sanpham_id, soluong = 1) => {
        try {
            const response = await apiConfig.post(API.GIOHANG.ADD, { sanpham_id, soluong });
            return { success: true, raw: response.data };
        } catch (error) {
            console.log(error)
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm vào giỏ hàng' };
        }
    },
    updateQuantity: async (sanpham_id, soluong) => {
        try {
            const response = await apiConfig.put(API.GIOHANG.UPDATE, { sanpham_id, soluong });
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật số lượng' };
        }
    },
    removeProduct: async (sanpham_id) => {
        try {
            const response = await apiConfig.delete(API.GIOHANG.DELETE(sanpham_id));
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa sản phẩm' };
        }
    },
    checkout: async (diachi, sdt, name, phuongthucthanhtoan = 0) => {
        try {
            const response = await apiConfig.post(API.GIOHANG.CHECKOUT, { diachi, sdt, name, phuongthucthanhtoan });
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thanh toán' };
        }
    },
    // getPaymentDetail: async (id) => {
    //     try {
    //         const response = await apiConfig.get(API.PAYMENT.DETAIL(id))
    //         return { success: true, raw: response.data }
    //     } catch (error) {
    //         return { success: false, message: error.response?.data?.message || 'Lỗi lấy chi tiết' }
    //     }
    // }
};
