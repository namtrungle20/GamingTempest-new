import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';

export const rankService = {
    getRank: async () => {
        try {
            const res = await apiConfig.get(API.USERS.RANK);
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy hạng thành viên' };
        }
    },

    updateRank: async (nguoidung_id) => {
        try {
            const res = await apiConfig.post(API.USERS.RANK_UPDATE, nguoidung_id ? { nguoidung_id } : {});
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật hạng' };
        }
    },

    checkRank: async (nguoidung_id) => {
        try {
            const res = await apiConfig.get(API.USERS.RANK_CHECK);
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật hạng' };
        }
    },
    allUpdateRank: async (nguoidung_id) => {
        try {
            const res = await apiConfig.post(API.USERS.RANK_ALL_UPDATE, nguoidung_id ? { nguoidung_id } : {});
            return { success: true, raw: res.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật hạng' };
        }
    }
};
