import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const uuDaiService = {
    getDanhSach: async () => {
        try {
            const res = await apiConfig.get(API.UUDAI.LIST)
            return { success: true, data: res.data.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi tải danh sách ưu đãi' }
        }
    },

    getCuaToi: async () => {
        try {
            const res = await apiConfig.get(API.UUDAI.LIST_ME)
            return { success: true, data: res.data.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi tải ưu đãi' }
        }
    },

    update: async (hang, payload) => {
        try {
            const res = await apiConfig.put(API.UUDAI.UPDATE(hang), payload)
            return { success: true, data: res.data.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật ưu đãi' }
        }
    },
}

export default uuDaiService