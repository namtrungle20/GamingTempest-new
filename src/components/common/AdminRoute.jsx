import { Navigate } from 'react-router-dom';
import useAuth from '@/hook/useAuth';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    if (!user.isAdmin) return <Navigate to="/" replace />;
    return children;
};

export default AdminRoute;