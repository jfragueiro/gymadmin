import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../hooks/useClients.js';
import ClientFormModal from '../../components/clients/ClientFormModal.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useClients({ search, page, limit: 20 });

  const clients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} clientes registrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Documento</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Registrado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Cargando...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-red-500">
                  Error al cargar clientes
                </td>
              </tr>
            )}
            {!isLoading && !isError && clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  {search ? 'Sin resultados para esta búsqueda' : 'No hay clientes registrados'}
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{client.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{client.documentNumber || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{client.email}</td>
                <td className="px-4 py-3 text-gray-600">{client.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/clients/${client.id}`); }}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showModal && <ClientFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
