import { useState } from 'react';
import { useMe, useUpdateMe } from '../../hooks/useUsers.js';

const ROLE_LABELS = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  profesor: 'Profesor',
  recepcionista: 'Recepcionista',
  cajero: 'Cajero',
};

export default function MyProfilePage() {
  const { data: me, isLoading } = useMe();
  const { mutate: updateMe, isPending, isSuccess, error } = useUpdateMe();

  const [nameForm, setNameForm] = useState({ name: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const handleNameSubmit = (e) => {
    e.preventDefault();
    updateMe({ name: nameForm.name || me.name });
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('Las contraseñas no coinciden');
      return;
    }
    updateMe(
      { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
      { onSuccess: () => setPwForm({ currentPassword: '', newPassword: '', confirm: '' }) }
    );
  };

  if (isLoading) return <div className="text-center py-16 text-gray-400">Cargando...</div>;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-500 mt-0.5">{ROLE_LABELS[me?.role] ?? me?.role}</p>
      </div>

      {/* Name */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Datos personales</h2>
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              value={nameForm.name || me?.name || ''}
              onChange={(e) => setNameForm({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={me?.name ?? 'Tu nombre'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={me?.email ?? ''}
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
            />
          </div>
          {isSuccess && <p className="text-green-600 text-sm">Cambios guardados</p>}
          {error && <p className="text-red-500 text-sm">Error al guardar</p>}
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Cambiar contraseña</h2>
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
          {error && <p className="text-red-500 text-sm">Contraseña actual incorrecta</p>}
          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isPending ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
