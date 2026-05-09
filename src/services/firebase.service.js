import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebaseConfig';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
    } catch (error) {
        console.error('Lỗi đăng nhập Google:', error);
        throw error;
    }
};

export const logoutFirebase = async () => {
    await auth.signOut();
};