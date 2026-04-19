import axios from 'axios'
import { toast } from 'sonner'

const apiConfig = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

apiConfig.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status
        const url = error.config?.url ?? ''
        const isLoginRoute = url.includes('/auth/dangnhap')
        const isAuthMe = url.includes('/auth/me')

        if (!isLoginRoute) {
            if (status === 401 || (status === 404 && isAuthMe)) {
                localStorage.clear()
            }
        }
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra với máy chủ'
        if (status !== 401 && !(status === 404 && isAuthMe)) {
            toast.error(errorMessage)
        }

        return Promise.reject(error)
    }
)

export default apiConfig