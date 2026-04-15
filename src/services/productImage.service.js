import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

export const hinhAnhService = {
    getAll: async (params) => {
        try {
            const response = await apiConfig.get(API.HINHANH.LIST, { params });
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy danh sách ảnh' };
        }
    },
    getById: async (id) => {
        try {
            const response = await apiConfig.get(API.HINHANH.DETAIL(id));
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy chi tiết ảnh' };
        }
    },
    create: async (data) => {
        try {
            const response = await apiConfig.post(API.HINHANH.LIST, data);
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm ảnh' };
        }
    },
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(API.HINHANH.DETAIL(id));
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa ảnh' };
        }
    },
};