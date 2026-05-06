import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCategoryEntries, useAddEntry, useDeleteEntry } from '../../hooks/useCategoryEntries.js';

const MONTH_LABELS = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

function fmt(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function monthLabel(month) {
  const [year, m] = month.split('-');
  return `${MONTH_LABELS[m]} ${year}`;
}

function AddEntryForm({ categoryId, month, onSuccess }) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const addEntry = useAddEntry(Number(categoryId), month);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || !amount) return;
    addEntry.mutate(
      { month, label: label.trim(), amount: Number(amount) },
      {
        onSuccess: () => {
          setLabel('');
          setAmount('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end flex-wrap">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Concepto</label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez - Recepcionista"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Monto</label>
        <input
          type="number"
          placeholder="350000"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={!label.trim() || !amount || addEntry.isPending}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {addEntry.isPending ? 'Guardando...' : '+ Agregar'}
      </button>
    </form>
  );
}

export default function FinanceDetailPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const month = searchParams.get('month');

  const { data, isLoading, isError } = useCategoryEntries(Number(categoryId), month);
  const deleteEntry = useDeleteEntry(Number(categoryId), month);

  if (!month) {
    return <div className="p-6 text-red-500 text-sm">Parámetro month requerido.</div>;
  }

  if (isLoading) {
    return <div className="p-6 text-gray-400 text-sm animate-pulse">Cargando...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600 text-sm">Error al cargar los datos.</div>;
  }

  const { category, entries = [], total } = data || {};

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/finances')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Volver
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category?.name}</h1>
          <p className="text-sm text-gray-500">{monthLabel(month)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Concepto
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Monto
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="group hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-800">{entry.label}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">
                  {fmt(entry.amount)}
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => deleteEntry.mutate(entry.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-xs"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">
                  Sin entradas para este mes.
                </td>
              </tr>
            )}
          </tbody>
          {entries.length > 0 && (
            <tfoot className="border-t border-gray-200 bg-gray-50">
              <tr>
                <td className="px-5 py-3 text-sm font-semibold text-gray-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-gray-900">{fmt(total)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <p className="text-sm font-medium text-gray-700">Agregar entrada</p>
        <AddEntryForm categoryId={categoryId} month={month} />
      </div>
    </div>
  );
}
