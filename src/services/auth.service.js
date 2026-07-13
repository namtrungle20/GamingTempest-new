import { API } from '@/constants/apiConstants';
import apiConfig from '../config/apiConfig';

export const authService = {

    login: async (loginKey, password) => {
        if (!loginKey) return { success: false, message: "Thiếu tên đăng nhập" };

        const isSdt = /^[+\d]+$/.test(String(loginKey).trim());
        const payload = {
            password,
            [isSdt ? 'sdt' : 'name']: loginKey.trim()
        };
        try {
            const response = await apiConfig.post(API.AUTH.LOGIN, payload);
            return {
                success: true,
                raw: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi server"
            };
        }
    },
    register: async (userData) => {
        try {
            const response = await apiConfig.post(API.AUTH.REGISTER, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Đăng ký thất bại"
            };
        }
    },
    getMe: async () => {
        try {
            const response = await apiConfig.get(API.AUTH.LIST)
            return { success: true, raw: response.data }
        } catch (error) {
            return {
                success: false,
                raw: error.response  // ✅ giữ lại response để check status 401/403/404
            }
        }
    },
    loginWithGoogle: async (idToken) => {
        try {
            const response = await apiConfig.post(API.AUTH.GOOGLE, { idToken });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng nhập Google thất bại'
            };
        }
    },
    refresh: async () => {
        try {
            const response = await apiConfig.post(API.AUTH.REFRESH)
            return { success: true, accessToken: response.data?.data?.accessToken }
        } catch (error) {
            return { success: false }
        }
    },
};

export const authResetService = {
    quenMatKhau: async ({ sdt, email }) => {
        try {
            const res = await apiConfig.post(API.AUTH.QUEN_MAT_KHAU, { sdt, email })
            return { success: true, message: res.data.message }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra' }
        }
    },

    datLaiMatKhau: async (token, matKhauMoi) => {
        try {
            const res = await apiConfig.post(API.AUTH.DAT_LAI_MAT_KHAU, { token, matKhauMoi })
            return { success: true, message: res.data.message }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra' }
        }
    },
}
