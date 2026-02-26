import apiConfig from '../config/apiConfig';

export const authService = {

    login: async (loginKey, password) => {
        if (!loginKey) return { success: false, message: "Thiếu tên đăng nhập" };

        const isEmail = String(loginKey).includes('@');
        const payload = {
            password,
            [isEmail ? 'email' : 'sdt']: loginKey
        };
        try {
            const response = await apiConfig.post('/auth/dangnhap', payload);
            console.log('RAW RESPONSE:', response.data);
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
    }
};