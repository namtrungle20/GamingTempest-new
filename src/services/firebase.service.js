import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebaseConfig';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
    } catch (error) {
        let errorMessage = 'Đăng nhập Google thất bại. Vui lòng thử lại.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Bạn đã đóng cửa sổ đăng nhập. Hãy mở lại và chọn tài khoản Google.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Yêu cầu đăng nhập bị hủy. Vui lòng thử lại.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Lỗi kết nối mạng. Kiểm tra internet và thử lại.';
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'Domain không được phép. Liên hệ quản trị viên.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'Không tìm thấy người dùng.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Sai mật khẩu.';
        } else {
            console.error('Lỗi đăng nhập Google:', error);
        }
        return { success: false, message: errorMessage, error };
    }
};

export const logoutFirebase = async () => {
    try {
        await auth.signOut();
        return { success: true, message: 'Đăng xuất thành công' };
    } catch (error) {
        console.error('Lỗi đăng xuất Firebase:', error);
        return { success: false, message: 'Đăng xuất thất bại', error };
    }
};