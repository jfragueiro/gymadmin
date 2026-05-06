import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGymMetrics } from '../../hooks/useGymMetrics.js';

function getDefaultDates() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { startDate: fmt(start), endDate: fmt(now) };
}

function StatCard({ label, value, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-3xl font-bold text-gray-900">
        {loading ? <span className="text-gray-300 animate-pulse">—</span> : value}
      </span>
    </div>
  );
}

export default function GymMetricsPage() {
  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [applied, setApplied] = useState(defaults);

  const { data, isLoading, isError } = useGymMetrics(applied.startDate, applied.endDate);

  const handleApply = () => setApplied({ startDate, endDate });

  const chartData = (data?.checkInsPerClient ?? []).slice(0, 15).map((c) => ({
    name: c.clientName.split(' ')[0],
    fullName: c.clientName,
    ingresos: c.total,
  }));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Métricas del Gimnasio</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de actividad por período</p>
      </div>

      {/* Selector de período */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Filtrar
        </button>
      </div>

      {isError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Error al cargar las métricas. Verificá el rango de fechas.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Clientes registrados en el período"
          value={data?.clientsRegistered ?? 0}
          loading={isLoading}
        />
        <StatCard
          label="Visitantes únicos"
          value={data?.uniqueVisitors ?? 0}
          loading={isLoading}
        />
        <StatCard
          label="Total de ingresos"
          value={data?.totalCheckIns ?? 0}
          loading={isLoading}
        />
      </div>

      {/* Gráfico: ingresos por cliente */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Ingresos por cliente <span className="text-xs text-gray-400 font-normal">(top 15)</span>
        </h2>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm animate-pulse">
            Cargando...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            Sin registros en este período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value} ingresos`,
                  props.payload.fullName,
                ]}
              />
              <Bar dataKey="ingresos" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tabla detallada */}
      {!isLoading && (data?.checkInsPerClient?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Detalle por cliente</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.checkInsPerClient.map((c, i) => (
                <tr key={c.clientId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.clientName}</td>
                  <td className="px-6 py-3 text-right font-semibold text-blue-700">
                    {c.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TODO: Horarios pico */}
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base font-semibold text-gray-700">Horarios pico</h2>
          <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
            TODO — Próximamente
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Distribución de ingresos por hora del día para identificar los horarios de mayor afluencia.
          Esta métrica está pendiente de implementación (ver <code className="bg-gray-100 px-1 rounded text-xs">specs.md § 14 MG004</code>).
        </p>
      </div>
    </div>
  );
}
