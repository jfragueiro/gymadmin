import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import kioscoApi from '../../api/kiosco.api.js';

const POLL_INTERVAL_MS = 3000;

function useCountdown(expiresAt) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  return { secondsLeft, display: `${minutes}:${seconds}` };
}

export default function KioscoPage() {
  const [step, setStep] = useState('form'); // form | qr | success | expired
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null); // { token, expiresAt, clientName }
  const [successData, setSuccessData] = useState(null);
  const pollRef = useRef(null);
  const { secondsLeft, display: countdown } = useCountdown(session?.expiresAt);

  // Polling: verifica si el QR fue escaneado
  useEffect(() => {
    if (step !== 'qr' || !session) return;

    pollRef.current = setInterval(async () => {
      try {
        const { status } = await kioscoApi.getStatus(session.token);
        if (status === 'used') {
          clearInterval(pollRef.current);
          setSuccessData({ clientName: session.clientName });
          setStep('success');
          setTimeout(() => resetToForm(), 4000);
        } else if (status === 'expired') {
          clearInterval(pollRef.current);
          setStep('expired');
        }
      } catch {
        // Si el token no existe, volver al form
        clearInterval(pollRef.current);
        setStep('form');
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollRef.current);
  }, [step, session]);

  // Vence por countdown
  useEffect(() => {
    if (step === 'qr' && secondsLeft === 0 && session) {
      clearInterval(pollRef.current);
      setStep('expired');
    }
  }, [secondsLeft, step, session]);

  const resetToForm = () => {
    setStep('form');
    setDni('');
    setSession(null);
    setError('');
    setSuccessData(null);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (dni.trim().length < 6) return;
    setLoading(true);
    setError('');
    try {
      const data = await kioscoApi.requestQR(dni.trim());
      setSession(data);
      setStep('qr');
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al solicitar el QR');
    } finally {
      setLoading(false);
    }
  };

  const qrUrl = session
    ? `${window.location.origin}/kiosco-scan/${session.token}`
    : '';

  // ── Pantallas ─────────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <Screen>
        <div className="text-8xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">¡Bienvenido!</h1>
        <p className="text-xl text-gray-700 font-medium">{successData?.clientName}</p>
        <p className="text-gray-400 text-sm mt-2">Check-in registrado correctamente</p>
      </Screen>
    );
  }

  if (step === 'expired') {
    return (
      <Screen>
        <div className="text-8xl mb-4">⏰</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">QR vencido</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Los 15 minutos expiraron sin que el QR fuera escaneado.
        </p>
        <button
          onClick={resetToForm}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          Solicitar nuevo QR
        </button>
      </Screen>
    );
  }

  if (step === 'qr') {
    return (
      <Screen>
        <p className="text-sm text-gray-500 mb-1">Hola, <strong>{session.clientName}</strong></p>
        <p className="text-sm text-gray-400 mb-5">Escaneá el código con tu celular para ingresar</p>

        <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
          <QRCodeSVG value={qrUrl} size={220} level="M" includeMargin />
        </div>

        <div className={`mt-5 text-3xl font-mono font-bold tabular-nums ${
          secondsLeft <= 60 ? 'text-red-500' : 'text-gray-700'
        }`}>
          {countdown}
        </div>
        <p className="text-xs text-gray-400 mt-1">tiempo restante</p>

        {secondsLeft <= 60 && (
          <p className="mt-3 text-xs text-red-400 font-medium">⚠ El QR vence pronto</p>
        )}

        <button
          onClick={resetToForm}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Cancelar
        </button>
      </Screen>
    );
  }

  // step === 'form'
  return (
    <Screen>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Check-in</h1>
      <p className="text-sm text-gray-400 mb-8">Ingresá tu número de documento para obtener tu QR</p>

      <form onSubmit={handleRequest} className="w-full space-y-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Número de documento"
          value={dni}
          onChange={(e) => { setDni(e.target.value); setError(''); }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || dni.trim().length < 6}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
            loading || dni.trim().length < 6
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generando QR...' : 'Obtener QR'}
        </button>
      </form>
    </Screen>
  );
}

function Screen({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center max-w-sm w-full">
        <div className="text-xl font-bold text-gray-800 mb-6">GymAdmin</div>
        {children}
      </div>
    </div>
  );
}
