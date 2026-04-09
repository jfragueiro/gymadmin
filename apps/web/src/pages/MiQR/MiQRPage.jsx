import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function MiQRPage() {
  const { token } = useParams();
  const checkInUrl = `${window.location.origin}/check-in/${token}`;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div
        id="qr-card"
        className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center max-w-xs w-full print:shadow-none"
      >
        <div className="text-lg font-bold text-gray-900 mb-1">GymAdmin</div>
        <p className="text-sm text-gray-400 mb-6">Escanea para hacer check-in</p>
        <QRCodeSVG value={checkInUrl} size={200} level="M" includeMargin />
        <p className="text-xs text-gray-400 mt-6 text-center break-all">{checkInUrl}</p>
      </div>
      <button
        onClick={handlePrint}
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 print:hidden"
      >
        Descargar / Imprimir
      </button>
    </div>
  );
}
