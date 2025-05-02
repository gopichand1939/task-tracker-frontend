// File: src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ✅ updated import

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
