import { useCallback, useState, useEffect } from 'react'
import { authService } from '@/services/auth.service.js'
import { AuthContext } from '@/hook/provider/AuthContext'
import { signInWithGoogle, logoutFirebase } from '@/services/firebase.service'
import User from '@/models/User'
import socket from '@/config/socket'
import { USER_ROLE } from '@/constants/UserConstants'


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
                    localStorage.removeItem('accessToken');
                    setUser(null)
                }
            } catch {
                localStorage.removeItem('accessToken');
            } finally {
                setLoading(false)
            }
        }
        verifySession()
    }, [])

    useEffect(() => {
        if (user?.id) {
            if (!socket.connected) socket.connect()
            socket.emit('join-user', user.id)
        }
    }, [user?.id])

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

            const userInstance = new User(nguoidung)
            console.log('nguoidung từ API:', nguoidung)
            console.log('userInstance.role:', userInstance.vaitro, typeof userInstance.vaitro)
            console.log('USER_ROLE.ADMIN:', USER_ROLE.ADMIN, typeof USER_ROLE.ADMIN)

            setUser(userInstance)

            const redirectTo = userInstance.vaitro === USER_ROLE.ADMIN ? '/admin' : '/'
            return { success: true, redirectTo }
        } catch (err) {
            // console.error('LOGIN ERROR:', err)
            const errorMessage = err.response?.data?.message || 'Không thể kết nối đến máy chủ';
            setError(errorMessage);
            return { success: false, message: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = async (name, sdt, password) => {
        setLoading(true)
        setError(null)
        try {
            const result = await authService.register({ name, sdt, password })
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

    const loginWithGoogle = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // 1. Lấy idToken từ Firebase
            const { idToken } = await signInWithGoogle()
            // 2. Gửi lên backend
            const result = await authService.loginWithGoogle(idToken)
            if (!result.success) {
                setError(result.message)
                return { success: false, message: result.message }
            }
            const { accessToken, refreshToken, nguoidung } = result.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('user', JSON.stringify(nguoidung))
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
            setUser(new User(nguoidung))
            return { success: true }
        } catch (err) {
            const errorMessage = err.message || 'Đăng nhập Google thất bại'
            setError(errorMessage)
            return { success: false, message: errorMessage }
        } finally {
            setLoading(false)
        }
    }, [])



    const logout = useCallback(async () => {
        try {
            await logoutFirebase() // Đăng xuất khỏi Firebase (nếu có)
        } catch (err) {
            console.warn('Lỗi khi đăng xuất Firebase:', err)
        } finally {
            socket.disconnect()
            localStorage.clear()
            setUser(null)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    )

}

export { useAuth } from './AuthContext';