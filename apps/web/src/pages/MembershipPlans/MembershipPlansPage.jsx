import { useState } from 'react';
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from '../../hooks/usePlans.js';
import { formatCurrency } from '../../utils/formatters.js';

export default function MembershipPlansPage() {
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', plan }
  const [confirmDelete, setConfirmDelete] = useState(null); // plan to delete

  const { data: plans = [], isLoading } = usePlans();
  const { mutate: deletePlan, isPending: deleting } = useDeletePlan();

  const handleDelete = () => {
    deletePlan(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Membresía</h1>
          <p className="text-sm text-gray-500 mt-0.5">{plans.length} planes configurados</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Nuevo Plan
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-400 py-16">Cargando...</p>
      )}

      {!isLoading && plans.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No hay planes creados</p>
          <p className="text-sm">Crea un plan para poder asignarlo a los clientes</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 text-base">{plan.name}</h3>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(plan.price)}</span>
            </div>

            <p className="text-sm text-gray-500 flex-1">
              {plan.description || <span className="italic text-gray-300">Sin descripción</span>}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {plan.durationDays} días
              </span>
              {plan.durationDays % 30 === 0 && (
                <span className="text-gray-400 text-xs">
                  ({plan.durationDays / 30} {plan.durationDays / 30 === 1 ? 'mes' : 'meses'})
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => setModal({ mode: 'edit', plan })}
                className="flex-1 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirmDelete(plan)}
                className="flex-1 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <PlanFormModal
          mode={modal.mode}
          plan={modal.plan}
          onClose={() => setModal(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Eliminar plan</h2>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de eliminar el plan <strong>{confirmDelete.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanFormModal({ mode, plan, onClose }) {
  const [form, setForm] = useState({
    name: plan?.name ?? '',
    description: plan?.description ?? '',
    price: plan?.price ?? '',
    durationDays: plan?.durationDays ?? '',
  });
  const [errors, setErrors] = useState({});

  const { mutate: create, isPending: creating } = useCreatePlan();
  const { mutate: update, isPending: updating } = useUpdatePlan();
  const isPending = creating || updating;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Requerido';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Debe ser mayor a 0';
    if (!form.durationDays || Number(form.durationDays) < 1) errs.durationDays = 'Mínimo 1 día';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: parseFloat(form.price),
      durationDays: parseInt(form.durationDays),
    };

    if (mode === 'create') {
      create(payload, { onSuccess: onClose });
    } else {
      update({ id: plan.id, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {mode === 'create' ? 'Nuevo Plan' : 'Editar Plan'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre del plan" error={errors.name}>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="Ej. Mensual, Trimestral, Anual"
              className={input(errors.name)}
            />
          </Field>

          <Field label="Descripción" error={errors.description}>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Beneficios incluidos (opcional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (MXN)" error={errors.price}>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set('price')}
                placeholder="0.00"
                className={input(errors.price)}
              />
            </Field>
            <Field label="Duración (días)" error={errors.durationDays}>
              <input
                type="number"
                min="1"
                value={form.durationDays}
                onChange={set('durationDays')}
                placeholder="30"
                className={input(errors.durationDays)}
              />
            </Field>
          </div>

          {form.durationDays > 0 && (
            <p className="text-xs text-gray-400">
              Equivale a aprox. {(form.durationDays / 30).toFixed(1)} mes(es)
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : mode === 'create' ? 'Crear Plan' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
