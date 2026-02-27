import { createContext, useState } from 'react';
import { authService } from '../../services/authService';
import User from '../../models/User';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        if (!stored || stored === 'undefined') return null;
        try {
            return new User(JSON.parse(stored));
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (loginKey, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.login(loginKey, password);
            console.log('RAW RESPONSE:', result.raw);

            if (!result.success) {
                setError(result.message);
                return { success: false };
            }

            const { accessToken, refreshToken, nguoidung } = result.raw.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(nguoidung));
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            setUser(new User(nguoidung));
            return { success: true };
        } catch (err) {
            setError('Đã có lỗi xảy ra');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, sdt, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.register({ email, sdt, password });
            if (!result.success) {
                setError(result.message);
                return { success: false };
            }
            return { success: true };
        } catch (err) {
            setError('Đã có lỗi xảy ra');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};