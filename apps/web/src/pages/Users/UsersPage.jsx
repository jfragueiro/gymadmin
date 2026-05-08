import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers, useCreateUser, useUpdateUser, useToggleUserStatus } from '../../hooks/useUsers.js';
import { formatDate } from '../../utils/formatters.js';
import useAuthStore from '../../store/authStore.js';

const ROLE_VALUES = ['admin', 'supervisor', 'profesor', 'recepcionista', 'cajero'];

const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100),
  role: z.enum(ROLE_VALUES, { errorMap: () => ({ message: 'Rol inválido' }) }),
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  role: z.enum(ROLE_VALUES, { errorMap: () => ({ message: 'Rol inválido' }) }).optional(),
});

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
  const apiError = createError || updateError;
  const isSelf = user?.id === currentUserId;

  const schema = mode === 'create' ? createUserSchema : updateUserSchema;
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user?.role ?? 'recepcionista',
    },
  });

  const onSubmit = (data) => {
    if (mode === 'create') {
      create(data, { onSuccess: onClose });
    } else {
      const payload = { id: user.id, name: data.name, email: data.email };
      if (!isSelf) payload.role = data.role;
      update(payload, { onSuccess: onClose });
    }
  };

  const cls = (err) => `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Nombre completo" required error={errors.name}>
            <input {...register('name')} className={cls(errors.name)} placeholder="Juan Pérez" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input {...register('email')} type="email" className={cls(errors.email)} placeholder="juan@gym.com" />
          </Field>
          {mode === 'create' && (
            <Field label="Contraseña temporal" required error={errors.password}>
              <input {...register('password')} type="password" className={cls(errors.password)} placeholder="Mínimo 6 caracteres" />
            </Field>
          )}
          <Field label="Rol" error={errors.role}>
            <select {...register('role')} disabled={isSelf} className={`${cls(errors.role)} disabled:opacity-50`}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {isSelf && <p className="text-xs text-gray-400 mt-1">No puedes cambiar tu propio rol</p>}
          </Field>

          {apiError && (
            <p className="text-red-500 text-sm">
              {apiError?.response?.data?.error || 'Error al guardar usuario'}
            </p>
          )}

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

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function inputCls() {
  return 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
}
