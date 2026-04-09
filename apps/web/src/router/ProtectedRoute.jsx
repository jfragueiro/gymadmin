import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Layout from '../components/layout/Layout.jsx';

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/clients" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
