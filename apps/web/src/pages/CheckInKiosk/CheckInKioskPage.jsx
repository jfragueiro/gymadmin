import { useState } from 'react';
import { useClients } from '../../hooks/useClients.js';
import { useCheckIn } from '../../hooks/useAttendance.js';

export default function CheckInKioskPage() {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successName, setSuccessName] = useState(null);

  const { data: clientsData } = useClients({ search, limit: 8 }, { enabled: search.length > 1 });
  const clients = clientsData?.data ?? [];

  const { mutate: checkIn, isPending, reset } = useCheckIn();

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
          setSuccessName(selectedClient.name);
          setSelectedClient(null);
          setSearch('');
          setTimeout(() => {
            setSuccessName(null);
            reset();
          }, 3000);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-xl shadow-sm">
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

        {successName && (
          <p className="mt-3 text-green-600 text-sm font-medium">
            ✓ Check-in registrado para <span className="font-semibold">{successName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
