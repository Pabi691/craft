import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { userToken } = useAuth();
  const location = useLocation();
  if (!userToken) return <Navigate to="/login" replace state={{ slug: location.pathname }} />;
  return children;
}
