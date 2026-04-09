import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '../../hooks/useClients.js';
import {
  useTrainingPlans,
  useCreateTrainingPlan,
  useUpdateTrainingPlan,
  useDeleteTrainingPlan,
  useAddExercise,
  useRemoveExercise,
} from '../../hooks/useTrainingPlans.js';

export default function TrainingPlansPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [addingExerciseToPlan, setAddingExerciseToPlan] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: client } = useClient(clientId);
  const { data: plans = [], isLoading } = useTrainingPlans(clientId);
  const { mutate: deletePlan } = useDeleteTrainingPlan(clientId);

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/clients/${clientId}`)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← {client?.name ?? 'Perfil'}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de entrenamiento</h1>
          {client && (
            <p className="text-sm text-gray-500 mt-0.5">{client.name}</p>
          )}
        </div>
        <button
          onClick={() => setShowPlanModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Nuevo plan
        </button>
      </div>

      {/* Plans list */}
      {isLoading && (
        <p className="text-center py-12 text-gray-400">Cargando...</p>
      )}

      {!isLoading && plans.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Este cliente no tiene planes de entrenamiento</p>
          <button
            onClick={() => setShowPlanModal(true)}
            className="text-blue-600 text-sm hover:underline"
          >
            Crear el primer plan
          </button>
        </div>
      )}

      <div className="space-y-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            clientId={clientId}
            onEdit={() => setEditingPlan(plan)}
            onDelete={() => setConfirmDelete(plan)}
            onAddExercise={() => setAddingExerciseToPlan(plan.id)}
          />
        ))}
      </div>

      {/* Plan create/edit modal */}
      {(showPlanModal || editingPlan) && (
        <PlanFormModal
          clientId={clientId}
          plan={editingPlan}
          onClose={() => { setShowPlanModal(false); setEditingPlan(null); }}
        />
      )}

      {/* Add exercise modal */}
      {addingExerciseToPlan && (
        <ExerciseFormModal
          planId={addingExerciseToPlan}
          clientId={clientId}
          onClose={() => setAddingExerciseToPlan(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmDialog
          message={`¿Eliminar el plan "${confirmDelete.name}"?`}
          onConfirm={() => {
            deletePlan(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function PlanCard({ plan, clientId, onEdit, onDelete, onAddExercise }) {
  const [expanded, setExpanded] = useState(true);
  const { mutate: removeExercise } = useRemoveExercise(clientId);

  const dayGroups = plan.exercises.reduce((acc, ex) => {
    const day = ex.dayLabel || 'Sin día';
    if (!acc[day]) acc[day] = [];
    acc[day].push(ex);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Plan header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <button
          className="flex items-center gap-2 text-left flex-1"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-sm text-gray-400 w-4">{expanded ? '▾' : '▸'}</span>
          <div>
            <p className="font-semibold text-gray-900">{plan.name}</p>
            {plan.goal && <p className="text-xs text-gray-400 mt-0.5">{plan.goal}</p>}
          </div>
        </button>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-gray-400">{plan.exercises.length} ejercicios</span>
          <button onClick={onEdit} className="text-xs text-blue-600 hover:underline px-2">Editar</button>
          <button onClick={onDelete} className="text-xs text-red-500 hover:underline px-2">Eliminar</button>
        </div>
      </div>

      {/* Exercises */}
      {expanded && (
        <div className="px-5 py-4">
          {plan.exercises.length === 0 ? (
            <p className="text-sm text-gray-400 mb-3">Sin ejercicios aún</p>
          ) : (
            <div className="space-y-4 mb-4">
              {Object.entries(dayGroups).map(([day, exercises]) => (
                <div key={day}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{day}</p>
                  <div className="space-y-1">
                    {exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-sm"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-800">{ex.name}</span>
                          <span className="text-gray-400 text-xs">
                            {[
                              ex.sets && `${ex.sets} series`,
                              ex.reps && `${ex.reps} reps`,
                              ex.weightKg && `${ex.weightKg} kg`,
                              ex.restSeconds && `${ex.restSeconds}s desc.`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeExercise({ planId: plan.id, exerciseId: ex.id })}
                          className="text-gray-300 hover:text-red-500 transition-colors text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {plan.notes && (
            <p className="text-xs text-gray-400 mb-3 italic">{plan.notes}</p>
          )}

          <button
            onClick={onAddExercise}
            className="text-sm text-blue-600 hover:underline"
          >
            + Agregar ejercicio
          </button>
        </div>
      )}
    </div>
  );
}

function PlanFormModal({ clientId, plan, onClose }) {
  const { mutate: create, isPending: creating } = useCreateTrainingPlan(clientId);
  const { mutate: update, isPending: updating } = useUpdateTrainingPlan(clientId);
  const [form, setForm] = useState({
    name: plan?.name ?? '',
    goal: plan?.goal ?? '',
    notes: plan?.notes ?? '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isPending = creating || updating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (plan) {
      update({ id: plan.id, ...form }, { onSuccess: onClose });
    } else {
      create(form, { onSuccess: onClose });
    }
  };

  return (
    <Modal title={plan ? 'Editar plan' : 'Nuevo plan de entrenamiento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre del plan">
          <input
            value={form.name}
            onChange={set('name')}
            required
            className={inputCls()}
            placeholder="Ej. Fuerza — Semana 1"
          />
        </Field>
        <Field label="Objetivo">
          <input
            value={form.goal}
            onChange={set('goal')}
            className={inputCls()}
            placeholder="Ej. Hipertrofia, Pérdida de peso..."
          />
        </Field>
        <Field label="Notas">
          <textarea
            value={form.notes}
            onChange={set('notes')}
            className={`${inputCls()} resize-none`}
            rows={3}
            placeholder="Observaciones generales del plan..."
          />
        </Field>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : plan ? 'Guardar cambios' : 'Crear plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ExerciseFormModal({ planId, clientId, onClose }) {
  const { mutate: addExercise, isPending } = useAddExercise(clientId);
  const [form, setForm] = useState({
    name: '',
    dayLabel: '',
    sets: '',
    reps: '',
    weightKg: '',
    restSeconds: '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addExercise(
      {
        planId,
        name: form.name,
        dayLabel: form.dayLabel || undefined,
        sets: form.sets ? parseInt(form.sets) : undefined,
        reps: form.reps || undefined,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
        restSeconds: form.restSeconds ? parseInt(form.restSeconds) : undefined,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal title="Agregar ejercicio" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre del ejercicio">
          <input
            value={form.name}
            onChange={set('name')}
            required
            className={inputCls()}
            placeholder="Ej. Press de banca"
          />
        </Field>
        <Field label="Día">
          <input
            value={form.dayLabel}
            onChange={set('dayLabel')}
            className={inputCls()}
            placeholder="Ej. Día 1, Lunes..."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Series">
            <input
              type="number"
              min="1"
              value={form.sets}
              onChange={set('sets')}
              className={inputCls()}
              placeholder="3"
            />
          </Field>
          <Field label="Repeticiones">
            <input
              value={form.reps}
              onChange={set('reps')}
              className={inputCls()}
              placeholder="10 ó 8-12"
            />
          </Field>
          <Field label="Peso (kg)">
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.weightKg}
              onChange={set('weightKg')}
              className={inputCls()}
              placeholder="60"
            />
          </Field>
          <Field label="Descanso (seg)">
            <input
              type="number"
              min="0"
              value={form.restSeconds}
              onChange={set('restSeconds')}
              className={inputCls()}
              placeholder="90"
            />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <p className="text-gray-800 text-sm mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {children}
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
