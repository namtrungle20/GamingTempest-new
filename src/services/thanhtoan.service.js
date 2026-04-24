import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const thanhToanService = {
    create: async (payload) => {
        try {
            const response = await apiConfig.post(API.THANHTOAN.CREATE, payload)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi tạo thanh toán' }
        }
    },
    verifyReturn: async (params) => {
        try {
            const response = await apiConfig.get(API.THANHTOAN.RETURN, { params });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xác nhận thanh toán' };
        }
    }
}
