import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hook/provider/AuthContext';
import { USER_ROLE } from '@/constants/UserConstants';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // hoặc spinner
    }
    if (user?.vaitro !== USER_ROLE.ADMIN) return <Navigate to="/" replace />
    return children;
};

export default AdminRoute;