import { useCallback, useState, useEffect } from 'react'
import { authService } from '@/services/authService'
import { AuthContext } from '@/hook/provider/AuthContext'
import User from '@/models/User'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // ✅ true ngay từ đầu — chờ verify xong
    const [error, setError] = useState(null)

    // ✅ verify token với backend khi app load
    useEffect(() => {

        const verifySession = async () => {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const result = await authService.getMe() // gọi GET /auth/me
                if (result.success) {
                    setUser(new User(result.raw.data))
                } else {
                    // token invalid hoặc user không còn tồn tại
                    localStorage.clear()
                    setUser(null)
                }
            } catch {
                localStorage.clear()
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        verifySession()
    }, [])

    const login = useCallback(async (loginKey, password) => {
        setLoading(true)
        setError(null)
        try {
            const result = await authService.login(loginKey, password)
            if (!result.success) {
                setError(result.message)
                return { success: false }
            }
            const { accessToken, refreshToken, nguoidung } = result.raw.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('user', JSON.stringify(nguoidung))
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

            setUser(new User(nguoidung))
            return { success: true }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Không thể kết nối đến máy chủ';
            setError(errorMessage);
            return { success: false, message: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = async (email, sdt, password) => {
        setLoading(true)
        setError(null)
        try {
            const result = await authService.register({ email, sdt, password })
            if (!result.success) {
                setError(result.message)
                return { success: false }
            }
            return { success: true }
        } catch {
            setError('Đã có lỗi xảy ra')
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.clear()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    )
}