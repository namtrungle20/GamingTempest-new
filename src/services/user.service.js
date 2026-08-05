import apiConfig from "@/config/apiConfig"
import { API } from "@/constants/apiConstants"


export const NguoiDungService = {
    getAll: async (params) => {
        try {
            const response = await apiConfig.get(API.USERS.LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy danh mục' }
        }
    },
    create: async (data) => {
        try {
            const response = await apiConfig.post(API.USERS.DETAIL, data)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm người dùng' }
        }
    },
    update: async (id, data) => {
        try {
            const response = await apiConfig.put(API.USERS.UPDATE(id), data)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật người dùng' }
        }
    },
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(API.USERS.DELETE(id))
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa người dùng' }
        }
    },
    requestChangeEmail: async (emailMoi) => {
        try {
            const response = await apiConfig.post(API.USERS.CHANGE_EMAIL_REQUEST, { email_moi: emailMoi })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi gửi yêu cầu đổi email' }
        }
    },
    verifyChangeEmail: async (otp) => {
        try {
            const response = await apiConfig.post(API.USERS.CHANGE_EMAIL_VERIFY, { otp })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xác thực đổi email' }
        }
    },
}
