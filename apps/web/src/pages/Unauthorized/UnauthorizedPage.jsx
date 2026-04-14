import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-5xl font-bold text-gray-200 mb-4">403</p>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Sin permisos suficientes</h1>
        <p className="text-sm text-gray-500 mb-6">
          Tu rol <span className="font-medium text-gray-700">({user?.role})</span> no tiene acceso a esta sección.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
