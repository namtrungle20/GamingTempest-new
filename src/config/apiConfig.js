import axios from 'axios'
import { toast } from 'sonner'

const apiConfig = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'ngrok-skip-browser-warning': 'true' },
    withCredentials: true,
})

// ── Flag chống vòng lặp refresh ──────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve(token)
    })
    failedQueue = []
}

// ── Request interceptor ───────────────────────────────────────────────────────
apiConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json'
    }
    return config
})

// ── Response interceptor ──────────────────────────────────────────────────────
apiConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
            return Promise.reject(error)
        }
        const status = error.response?.status
        const url = error.config?.url ?? ''
        const originalRequest = error.config

        const isLoginRoute = url.includes('/auth/dangnhap')
        const isRefreshRoute = url.includes('/auth/refresh')
        const isAuthMe = url.includes('/auth/me')

        // ── 401 → thử silent refresh ─────────────────────────────────────────
        if (status === 401 && !isLoginRoute && !isRefreshRoute && !originalRequest._retry) {
            if (isRefreshing) {
                // Đang refresh → cho request này vào hàng chờ
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return apiConfig(originalRequest)
                }).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const res = await apiConfig.post('/auth/refresh')
                const newToken = res.data?.data?.accessToken

                if (!newToken) throw new Error('No token returned')

                localStorage.setItem('accessToken', newToken)
                apiConfig.defaults.headers.Authorization = `Bearer ${newToken}`
                processQueue(null, newToken)

                // Retry request gốc với token mới
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return apiConfig(originalRequest)
            } catch (refreshError) {
                // Refresh thất bại → logout hẳn
                processQueue(refreshError, null)
                localStorage.clear()
                toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại')
                window.location.href = '/'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        // ── Các lỗi khác ──────────────────────────────────────────────────────
        if (status === 401 && isRefreshRoute) {
            // Refresh token cũng hết hạn
            localStorage.clear()
            window.location.href = '/'
            return Promise.reject(error)
        }

        if (status === 404 && isAuthMe) {
            localStorage.clear()
            return Promise.reject(error)
        }

        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra với máy chủ'
        if (status !== 401 && !(status === 404 && isAuthMe)) {
            console.warn('[API Error]', url, status, errorMessage)
            toast.error(errorMessage)
        }

        return Promise.reject(error)
    }
)

export default apiConfig