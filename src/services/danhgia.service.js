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

    getListAll_Admin: async ({ page = 1, limit = 10, search, sosao, tuNgay, denNgay }) => {
        try {
            const res = await apiConfig.get(API.DANHGIA.ADMIN_LIST, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    sosao: sosao || undefined,
                    tuNgay: tuNgay || undefined,
                    denNgay: denNgay || undefined,
                }
            });
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy đánh giá' };
        }
    },

    checkDaMua: async ({ sanpham_id }) => {
        console.log('check-mua sanpham_id:', sanpham_id)
        try {
            const res = await apiConfig.get(API.DANHGIA.CHECK_DA_MUA, {
                params: { sanpham_id }
            });
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi kiểm tra đã mua' };
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