
// src/components/ProtectedRoute.jsx — PROTECT ALL ADMIN PAGES
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}