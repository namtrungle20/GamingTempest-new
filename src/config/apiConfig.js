import axios from 'axios';

const apiConfig = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động gắn Token vào header mỗi khi gửi request
apiConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const isAuthRoute = error.config.url.includes('/auth/dangnhap');

            // Nếu là route đăng nhập thì không redirect, để authService xử lý
            if (!isAuthRoute) {
                localStorage.clear();
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);
export default apiConfig;