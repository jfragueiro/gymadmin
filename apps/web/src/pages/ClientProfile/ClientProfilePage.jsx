import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClient, useUpdateClient } from '../../hooks/useClients.js';
import { useClientMemberships, useClientPayments } from '../../hooks/useMemberships.js';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { PAYMENT_METHOD_LABEL } from '../../utils/constants.js';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  documentNumber: z.string().optional(),
});

export default function ClientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const { data: client, isLoading, isError } = useClient(id);
  const { mutate: updateClient, isPending, error: saveError } = useUpdateClient(id);
  const { data: memberships = [] } = useClientMemberships(id);
  const { data: payments = [] } = useClientPayments(id);

  const activeMembership = memberships.find(
    (m) => m.status === 'active' && new Date(m.endDate) >= new Date()
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: client
      ? {
          name: client.name ?? '',
          phone: client.phone ?? '',
          birthDate: client.birthDate ? client.birthDate.split('T')[0] : '',
          documentNumber: client.documentNumber ?? '',
        }
      : undefined,
  });

  const onSubmit = (data) => {
    updateClient(data, {
      onSuccess: () => setEditing(false),
    });
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  if (isLoading) {
    return <div className="text-center py-16 text-gray-400">Cargando...</div>;
  }

  if (isError || !client) {
    return (
      <div className="text-center py-16 text-red-500">
        No se pudo cargar el cliente.
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/clients')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Clientes
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{client.email}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            client.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {client.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Personal data */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Datos personales
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Editar
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre completo" error={errors.name}>
                <input
                  {...register('name')}
                  className={inputCls(errors.name)}
                  placeholder="Juan Pérez"
                />
              </Field>
              <Field label="Número de documento" error={errors.documentNumber}>
                <input
                  {...register('documentNumber')}
                  className={inputCls()}
                  placeholder="DNI / Cédula / Pasaporte"
                />
              </Field>
              <Field label="Teléfono" error={errors.phone}>
                <input
                  {...register('phone')}
                  className={inputCls()}
                  placeholder="555-0000"
                />
              </Field>
              <Field label="Fecha de nacimiento" error={errors.birthDate}>
                <input
                  {...register('birthDate')}
                  type="date"
                  className={inputCls()}
                />
              </Field>
            </div>

            {saveError && (
              <p className="text-red-500 text-sm">Error al guardar los cambios</p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <DataItem label="Teléfono" value={client.phone} />
            <DataItem label="Documento" value={client.documentNumber} />
            <DataItem
              label="Fecha de nacimiento"
              value={client.birthDate ? formatDate(client.birthDate) : null}
            />
            <DataItem label="Registrado" value={formatDate(client.createdAt)} />
          </dl>
        )}
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => navigate(`/training-plans/${id}`)}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Planes de entrenamiento
        </button>
        <button
          onClick={() => navigate(`/metrics/${id}`)}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Métricas físicas
        </button>
      </div>

      {/* Active membership */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Membresía actual
        </h2>
        {activeMembership ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{activeMembership.planName ?? '—'}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {formatDate(activeMembership.startDate)} → {formatDate(activeMembership.endDate)}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Activa
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Sin membresía activa</p>
        )}
      </div>

      {/* History */}
      {(memberships.length > 0 || payments.length > 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Historial
          </h2>
          <div className="space-y-6">
            {memberships.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Membresías</h3>
                <div>
                  {memberships.map((m) => {
                    const active = m.status === 'active' && new Date(m.endDate) >= new Date();
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
                      >
                        <div>
                          <span className="font-medium text-gray-800">{m.planName ?? '—'}</span>
                          <span className="ml-3 text-gray-400 text-xs">
                            {formatDate(m.startDate)} → {formatDate(m.endDate)}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {active ? 'Activa' : 'Vencida'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {payments.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Pagos</h3>
                <div>
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{formatCurrency(p.amount)}</span>
                        <span className="ml-3 text-gray-400 text-xs">
                          {PAYMENT_METHOD_LABEL[p.method]} · {formatDate(p.paymentDate)}
                        </span>
                      </div>
                      {p.reference && (
                        <span className="text-xs text-gray-400">{p.reference}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DataItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-gray-800">{value || '—'}</dd>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
