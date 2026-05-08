import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useMembershipsOverview,
  useClientMemberships,
  useClientPayments,
  useAssignMembership,
  useRegisterPayment,
  usePlansCatalog,
} from '../../hooks/useMemberships.js';
import { formatDate, formatCurrency } from '../../utils/formatters.js';
import { PAYMENT_METHOD_LABEL } from '../../utils/constants.js';

const assignPlanFormSchema = z.object({
  planId: z.string().min(1, 'Seleccioná un plan'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
});

const registerPaymentFormSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  method: z.enum(['cash', 'card', 'transfer'], { errorMap: () => ({ message: 'Método inválido' }) }),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  reference: z.string().max(200).optional(),
});

export default function MembershipsPage() {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const { data: overview = [], isLoading } = useMembershipsOverview();

  const filtered = useMemo(() => {
    if (!search.trim()) return overview;
    const q = search.toLowerCase();
    return overview.filter(
      (r) =>
        r.clientName.toLowerCase().includes(q) ||
        r.clientEmail.toLowerCase().includes(q) ||
        (r.clientDocumentNumber && r.clientDocumentNumber.toLowerCase().includes(q))
    );
  }, [overview, search]);

  const today = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membresías</h1>
          <p className="text-sm text-gray-500 mt-0.5">{overview.length} clientes</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Vencimiento</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">Cargando...</td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  {search ? 'Sin resultados' : 'No hay clientes registrados'}
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const hasActive = !!row.membershipId;
              const isExpired = hasActive && new Date(row.endDate) < today;

              return (
                <tr key={row.clientId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{row.clientName}</p>
                    <p className="text-xs text-gray-400">{row.clientEmail}</p>
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {row.planName ? (
                      <>
                        {row.planName}
                        {row.planPrice && (
                          <span className="ml-1 text-xs text-gray-400">{formatCurrency(row.planPrice)}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-300 italic">Sin plan</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {!hasActive ? (
                      <Badge color="gray">Sin membresía</Badge>
                    ) : isExpired ? (
                      <Badge color="red">Vencida</Badge>
                    ) : (
                      <Badge color="green">Activa</Badge>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {row.endDate ? (
                      <span className={isExpired ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {formatDate(row.endDate)}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setModal({ client: row })}
                      className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <ManageClientModal client={modal.client} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function Badge({ color, children }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function ManageClientModal({ client, onClose }) {
  const [tab, setTab] = useState('assign');

  const { data: memberships = [] } = useClientMemberships(client.clientId);
  const { data: payments = [] } = useClientPayments(client.clientId);
  const activeMembership = memberships.find(
    (m) => m.status === 'active' && new Date(m.endDate) >= new Date()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{client.clientName}</h2>
            <p className="text-sm text-gray-400">{client.clientEmail}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1">
          {[['assign', 'Asignar plan'], ['payment', 'Registrar pago'], ['history', 'Historial']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'assign' && (
          <AssignPlanForm clientId={client.clientId} onSuccess={onClose} />
        )}
        {tab === 'payment' && (
          activeMembership
            ? <RegisterPaymentForm clientId={client.clientId} membershipId={activeMembership.id} onSuccess={onClose} />
            : <p className="text-sm text-gray-400 text-center py-8">El cliente no tiene membresía activa.</p>
        )}
        {tab === 'history' && (
          <HistoryTab memberships={memberships} payments={payments} />
        )}
      </div>
    </div>
  );
}

function AssignPlanForm({ clientId, onSuccess }) {
  const { data: plans = [] } = usePlansCatalog();
  const { mutate, isPending, error } = useAssignMembership();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(assignPlanFormSchema),
    defaultValues: { planId: '', startDate: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = (data) => mutate({ clientId, ...data }, { onSuccess });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plan <span className="text-red-500">*</span></label>
        <select {...register('planId')}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.planId ? 'border-red-400' : 'border-gray-300'}`}>
          <option value="">Seleccionar plan...</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatCurrency(p.price)} ({p.durationDays} días)
            </option>
          ))}
        </select>
        {errors.planId && <p className="text-red-500 text-xs mt-1">{errors.planId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio <span className="text-red-500">*</span></label>
        <input type="date" {...register('startDate')}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-400' : 'border-gray-300'}`} />
        {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
      </div>
      {error && <p className="text-red-500 text-sm">{error?.response?.data?.error || 'Error al asignar plan'}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {isPending ? 'Guardando...' : 'Asignar plan'}
        </button>
      </div>
    </form>
  );
}

function RegisterPaymentForm({ clientId, membershipId, onSuccess }) {
  const { mutate, isPending, error } = useRegisterPayment();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerPaymentFormSchema),
    defaultValues: {
      amount: '',
      method: 'cash',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: '',
    },
  });

  const cls = (err) => `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-400' : 'border-gray-300'}`;

  const onSubmit = (data) => mutate({ clientId, membershipId, ...data }, { onSuccess });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto <span className="text-red-500">*</span></label>
        <input type="number" step="0.01" min="0" placeholder="0.00" {...register('amount')} className={cls(errors.amount)} />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método <span className="text-red-500">*</span></label>
          <select {...register('method')} className={cls(errors.method)}>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
          {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha <span className="text-red-500">*</span></label>
          <input type="date" {...register('paymentDate')} className={cls(errors.paymentDate)} />
          {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
        <input type="text" placeholder="Opcional" {...register('reference')} className={cls()} />
      </div>
      {error && <p className="text-red-500 text-sm">{error?.response?.data?.error || 'Error al registrar pago'}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">
          {isPending ? 'Guardando...' : 'Registrar pago'}
        </button>
      </div>
    </form>
  );
}

function HistoryTab({ memberships, payments }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Membresías</h3>
        {memberships.length === 0
          ? <p className="text-sm text-gray-400">Sin historial</p>
          : memberships.map((m) => {
              const active = m.status === 'active' && new Date(m.endDate) >= new Date();
              return (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.planName || '—'}</p>
                    <p className="text-xs text-gray-400">{formatDate(m.startDate)} → {formatDate(m.endDate)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {active ? 'Activa' : 'Vencida'}
                  </span>
                </div>
              );
            })}
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pagos</h3>
        {payments.length === 0
          ? <p className="text-sm text-gray-400">Sin pagos registrados</p>
          : payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-gray-400">{PAYMENT_METHOD_LABEL[p.method]} · {formatDate(p.paymentDate)}</p>
                </div>
                {p.reference && <span className="text-xs text-gray-400">{p.reference}</span>}
              </div>
            ))}
      </div>
    </div>
  );
}
