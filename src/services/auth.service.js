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
            const response = await apiConfig.post('/auth/dangnhap', payload);
            // console.log('RAW RESPONSE:', response.data);
            return {
                success: true,
                raw: response.data // Trả về nguyên cục để Hook bóc tách
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
            const response = await apiConfig.post('/auth/dangky', userData);
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
            const response = await apiConfig.get('/auth/me')
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
            const response = await apiConfig.post('/auth/google', { idToken });
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng nhập Google thất bại'
            };
        }
    },
};