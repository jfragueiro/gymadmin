import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

const links = [
  { to: '/clients', label: 'Clientes' },
  { to: '/attendance', label: 'Asistencia' },
  { to: '/memberships', label: 'Membresías' },
  { to: '/membership-plans', label: 'Planes' },
];

export default function Sidebar() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-lg font-bold tracking-tight">GymAdmin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={clearAuth}
          className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
