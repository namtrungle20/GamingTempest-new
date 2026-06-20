import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

export const chitietsanphamService = {
    getAll: async (sanpham_id) => {
        try {
            const response = await apiConfig.get(API.CHITIETSANPHAM.LIST(sanpham_id));
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy chi tiết' };
        }
    },
    create: async (data) => {
        try {
            const response = await apiConfig.post(API.CHITIETSANPHAM.CREATE, data);
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm thuộc tính' };
        }
    },
    update: async (id, data) => {
        try {
            const response = await apiConfig.put(API.CHITIETSANPHAM.UPDATE(id), data);
            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật thuộc tính' };
        }
    },
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(API.CHITIETSANPHAM.DELETE(id));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa thuộc tính' };
        }
    },
    removeAll: async (sanpham_id) => {
        try {
            const response = await apiConfig.delete(API.CHITIETSANPHAM.DELETE_ALL(sanpham_id));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa thuộc tính' };
        }
    },
};