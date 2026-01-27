import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If seller role is required but user is not a seller, redirect to seller registration
  // But strictly check if they are NOT a seller (users may have other roles later)
  if (requireSeller && user?.role !== 'seller' && user?.role !== 'super_admin') {
    return <Navigate to="/seller-registration" replace />;
  }

  return children;
};

export default ProtectedRoute;
