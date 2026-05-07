import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterClient } from '../../hooks/useClients.js';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  documentNumber: z.string().min(1, 'El documento es obligatorio').min(6, 'Mínimo 6 caracteres'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
});

export default function ClientFormModal({ onClose }) {
  const { mutate, isPending, error } = useRegisterClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' });

  const [name, email, documentNumber] = watch(['name', 'email', 'documentNumber']);
  const canSubmit = (name?.length ?? 0) >= 2 &&
                    (email?.length ?? 0) >= 1 &&
                    (documentNumber?.length ?? 0) >= 6;

  const onSubmit = (data) => {
    mutate(data, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Nuevo Cliente</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Nombre completo" required error={errors.name}>
            <input {...register('name')} className={input(errors.name)} placeholder="Juan Pérez" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input {...register('email')} type="email" className={input(errors.email)} placeholder="juan@email.com" />
          </Field>
          <Field label="Número de documento" required error={errors.documentNumber}>
            <input {...register('documentNumber')} className={input(errors.documentNumber)} placeholder="DNI / Cédula / Pasaporte" />
          </Field>
          <Field label="Teléfono" error={errors.phone}>
            <input {...register('phone')} className={input()} placeholder="555-0000" />
          </Field>
          <Field label="Fecha de nacimiento" error={errors.birthDate}>
            <input {...register('birthDate')} type="date" className={input()} />
          </Field>

          {error && (
            <p className="text-red-500 text-sm">
              {error?.response?.data?.error || 'Error al registrar cliente'}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isPending}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                canSubmit && !isPending
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPending ? 'Guardando...' : 'Guardar'}
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
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function input(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
