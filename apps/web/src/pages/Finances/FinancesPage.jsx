import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFinancialSummary } from '../../hooks/useFinancialSummary.js';
import financesApi from '../../api/finances.api.js';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function monthLabel(month) {
  const [, m] = month.split('-');
  return MONTH_LABELS[parseInt(m) - 1];
}

function fmt(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

function AddCategoryModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Nueva categoría de gasto</h3>
        <input
          autoFocus
          type="text"
          placeholder="Ej: Alquiler, Internet..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancelar
          </button>
          <button
            onClick={() => name.trim() && onAdd(name.trim())}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinancesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useFinancialSummary(year);

  const addCategory = useMutation({
    mutationFn: (name) => financesApi.addCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances-summary'] });
      setShowModal(false);
    },
  });

  const handleCellClick = (month, categoryId) => {
    navigate(`/finances/${categoryId}?month=${month}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-400 text-sm animate-pulse">Cargando costos...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600 text-sm bg-red-50 rounded-lg">
        Error al cargar el módulo de costos.
      </div>
    );
  }

  const { categories = [], months = [] } = data || {};

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costos</h1>
          <p className="text-sm text-gray-500 mt-1">Balance de gastos por mes</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Mes
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total
              </th>
              {categories.map((cat) => (
                <th key={cat.id} className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {cat.name}
                </th>
              ))}
              <th className="px-3 py-3 text-center">
                <button
                  onClick={() => setShowModal(true)}
                  title="Agregar categoría"
                  className="text-blue-500 hover:text-blue-700 font-bold text-lg leading-none"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {months.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {monthLabel(row.month)}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-gray-900">
                  {row.grandTotal > 0 ? fmt(row.grandTotal) : <span className="text-gray-300">—</span>}
                </td>
                {categories.map((cat) => {
                  const val = row.totals[cat.id];
                  return (
                    <td key={cat.id} className="px-5 py-3 text-right">
                      {val !== null ? (
                        <button
                          onClick={() => handleCellClick(row.month, cat.id)}
                          className="text-blue-700 font-medium hover:underline"
                        >
                          {fmt(val)}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCellClick(row.month, cat.id)}
                          className="text-xs text-gray-400 border border-dashed border-gray-300 rounded px-2 py-0.5 hover:border-blue-400 hover:text-blue-500 transition-colors"
                        >
                          añadir
                        </button>
                      )}
                    </td>
                  );
                })}
                <td />
              </tr>
            ))}
          </tbody>
        </table>
        {months.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            Sin datos para este año.
          </div>
        )}
      </div>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onAdd={(name) => addCategory.mutate(name)}
        />
      )}
    </div>
  );
}
