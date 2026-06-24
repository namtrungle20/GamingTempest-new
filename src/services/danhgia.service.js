import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

export const danhGiaService = {
    getAll: async ({ sanpham_id, page = 1, limit = 10 }) => {
        try {
            const res = await apiConfig.get(API.DANHGIA.LIST, {
                params: { sanpham_id, page, limit }
            });
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy đánh giá' };
        }
    },

    create: async ({ sanpham_id, sosao, binhluan }) => {
        try {
            const res = await apiConfig.post(API.DANHGIA.CREATE, { sanpham_id, sosao, binhluan });
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Gửi đánh giá thất bại' };
        }
    },

    remove: async (danhgia_id) => {
        try {
            const res = await apiConfig.delete(`${API.DANHGIA.DELETE}/${danhgia_id}`);
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Xóa đánh giá thất bại' };
        }
    },
};