import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import qrApi from '../../api/qr.api.js';

export default function QRCheckInPage() {
  const { token } = useParams();
  const [state, setState] = useState('loading'); // loading | success | error
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    qrApi
      .publicCheckIn(token)
      .then((result) => {
        setData(result);
        setState('success');
      })
      .catch((err) => {
        setErrorMsg(
          err.response?.data?.error ||
            'Ocurrió un error al registrar tu asistencia'
        );
        setState('error');
      });
  }, [token]);

  if (state === 'loading') {
    return (
      <Screen>
        <div className="animate-pulse text-gray-400 text-lg">Registrando asistencia...</div>
      </Screen>
    );
  }

  if (state === 'success') {
    const time = new Date(data.checkedInAt).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <Screen>
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
        <p className="text-xl text-gray-700 font-medium mb-1">{data.clientName}</p>
        <p className="text-gray-400 text-sm">Check-in registrado a las {time}</p>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="text-7xl mb-6">❌</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">No se pudo registrar</h1>
      <p className="text-gray-500 text-center max-w-xs">{errorMsg}</p>
    </Screen>
  );
}

function Screen({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center max-w-sm w-full">
        {children}
      </div>
    </div>
  );
}
