import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hook/provider/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // hoặc spinner
    }
    if (!user.isAdmin) return <Navigate to="/" replace />;
    return children;
};

export default AdminRoute;