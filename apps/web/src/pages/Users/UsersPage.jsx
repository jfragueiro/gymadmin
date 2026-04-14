import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useToggleUserStatus } from '../../hooks/useUsers.js';
import { formatDate } from '../../utils/formatters.js';
import useAuthStore from '../../store/authStore.js';

const ROLES = [
  { value: 'admin',         label: 'Administrador' },
  { value: 'supervisor',    label: 'Supervisor' },
  { value: 'profesor',      label: 'Profesor' },
  { value: 'recepcionista', label: 'Recepcionista' },
  { value: 'cajero',        label: 'Cajero' },
];

const ROLE_COLORS = {
  admin:         'bg-purple-100 text-purple-700',
  supervisor:    'bg-blue-100 text-blue-700',
  profesor:      'bg-green-100 text-green-700',
  recepcionista: 'bg-yellow-100 text-yellow-700',
  cajero:        'bg-orange-100 text-orange-700',
};

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', user }

  const filters = {};
  if (filterRole) filters.role = filterRole;
  if (filterStatus !== '') filters.isActive = filterStatus === 'true';

  const { data: users = [], isLoading } = useUsers(filters);
  const { mutate: toggleStatus } = useToggleUserStatus();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Nuevo usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los roles</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rol</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Último acceso</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
            )}
            {!isLoading && users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay usuarios</td></tr>
            )}
            {users.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.name || '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                      {ROLES.find((r) => r.value === u.role)?.label ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={isSelf}
                      onClick={() => toggleStatus({ id: u.id, isActive: !u.isActive })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
                        u.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        u.isActive ? 'translate-x-4' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Nunca'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setModal({ mode: 'edit', user: u })}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <UserFormModal
          mode={modal.mode}
          user={modal.user}
          currentUserId={currentUser?.id}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function UserFormModal({ mode, user, currentUserId, onClose }) {
  const { mutate: create, isPending: creating, error: createError } = useCreateUser();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateUser();
  const isPending = creating || updating;
  const error = createError || updateError;

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    role: user?.role ?? 'recepcionista',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isSelf = user?.id === currentUserId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      create(form, { onSuccess: onClose });
    } else {
      const data = { id: user.id, name: form.name, email: form.email };
      if (!isSelf) data.role = form.role;
      update(data, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre completo">
            <input value={form.name} onChange={set('name')} required className={inputCls()} placeholder="Juan Pérez" />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={set('email')} type="email" required className={inputCls()} placeholder="juan@gym.com" />
          </Field>
          {mode === 'create' && (
            <Field label="Contraseña temporal">
              <input value={form.password} onChange={set('password')} type="password" required minLength={6} className={inputCls()} placeholder="Mínimo 6 caracteres" />
            </Field>
          )}
          <Field label="Rol">
            <select
              value={form.role}
              onChange={set('role')}
              disabled={isSelf}
              className={`${inputCls()} disabled:opacity-50`}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {isSelf && <p className="text-xs text-gray-400 mt-1">No puedes cambiar tu propio rol</p>}
          </Field>

          {error && <p className="text-red-500 text-sm">Error al guardar usuario</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isPending ? 'Guardando...' : mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function inputCls() {
  return 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
}
