import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Layout from '../components/layout/Layout.jsx';
import { hasPermission } from '../hooks/usePermission.js';

export default function ProtectedRoute({ module, required = 'full', children }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  // Module-level guard (used for wrapping specific routes)
  if (module && !hasPermission(user?.role, module, required)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children passed directly (nested guard), render without Layout
  // — the outer ProtectedRoute already wraps with Layout
  if (children) {
    return children;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
