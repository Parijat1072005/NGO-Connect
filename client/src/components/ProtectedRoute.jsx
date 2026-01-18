import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useAuth();
    // If no user, send them to login. They only see this if they try to visit /dashboard
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;