import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { usePermission } from '../../hooks/usePermission.js';

const NAV_LINKS = [
  { to: '/clients',          label: 'Clientes',      module: 'clients' },
  { to: '/attendance',       label: 'Asistencia',    module: 'attendance' },
  { to: '/memberships',      label: 'Membresías',    module: 'memberships' },
  { to: '/membership-plans', label: 'Planes',        module: 'memberships' },
  { to: '/finances',         label: 'Costos',        module: 'finances' },
  { to: '/users',            label: 'Usuarios',      module: 'users', required: 'full' },
];

function NavItem({ to, label, module, required = 'read' }) {
  const allowed = usePermission(module, required);
  if (!allowed) return null;
  return (
    <NavLink
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
  );
}

export default function Sidebar() {
  const { clearAuth } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-lg font-bold tracking-tight">GymAdmin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <button
          onClick={() => navigate('/my-profile')}
          className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {user?.name || user?.email || 'Mi perfil'}
        </button>
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
