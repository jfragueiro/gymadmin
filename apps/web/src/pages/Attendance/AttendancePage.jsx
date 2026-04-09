import { useState } from 'react';
import { useDailyAttendance, useCheckIn } from '../../hooks/useAttendance.js';
import { useClients } from '../../hooks/useClients.js';
import { formatDate } from '../../utils/formatters.js';

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: daily = [], isLoading: loadingDaily } = useDailyAttendance();
  const { data: clientsData } = useClients({ search, limit: 8 }, { enabled: search.length > 1 });
  const clients = clientsData?.data ?? [];

  const { mutate: checkIn, isPending, isSuccess, reset } = useCheckIn();

  const handleSelect = (client) => {
    setSelectedClient(client);
    setSearch(client.name);
    setShowDropdown(false);
  };

  const handleCheckIn = () => {
    if (!selectedClient) return;
    checkIn(
      { clientId: selectedClient.id },
      {
        onSuccess: () => {
          setSelectedClient(null);
          setSearch('');
          setTimeout(reset, 2000);
        },
      }
    );
  };

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asistencia</h1>
        <p className="text-sm text-gray-500 mt-0.5 capitalize">{today}</p>
      </div>

      {/* Check-in panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Registrar check-in
        </h2>
        <div className="flex gap-3 items-start">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o documento..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedClient(null);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && search.length > 1 && clients.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                {clients.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    {c.documentNumber && (
                      <span className="ml-2 text-gray-400 text-xs">{c.documentNumber}</span>
                    )}
                    <span className="ml-2 text-gray-400 text-xs">{c.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleCheckIn}
            disabled={!selectedClient || isPending}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 whitespace-nowrap"
          >
            {isPending ? 'Registrando...' : 'Check-in'}
          </button>
        </div>
        {isSuccess && (
          <p className="mt-3 text-green-600 text-sm font-medium">
            ¡Check-in registrado correctamente!
          </p>
        )}
        {selectedClient && !isSuccess && (
          <p className="mt-2 text-blue-600 text-sm">
            Cliente seleccionado: <span className="font-medium">{selectedClient.name}</span>
          </p>
        )}
      </div>

      {/* Today's list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Presentes hoy
          </h2>
          <span className="text-sm font-bold text-blue-600">{daily.length}</span>
        </div>

        {loadingDaily && (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">Cargando...</p>
        )}

        {!loadingDaily && daily.length === 0 && (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">
            Ningún check-in registrado hoy
          </p>
        )}

        {daily.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {daily.map((record) => (
              <li key={record.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.clientName}</p>
                  <p className="text-xs text-gray-400">{record.clientEmail}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(record.checkedInAt).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
