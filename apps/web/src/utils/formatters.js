/**
 * Formatea una fecha ISO a DD/MM/YYYY
 * @param {string} isoDate
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formatea un número como moneda en MXN
 * @param {number} amount
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
    amount
  );

/**
 * Calcula IMC y retorna la clasificación
 * @param {number} weightKg
 * @param {number} heightCm
 */
export const getBMILabel = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi < 18.5) return { value: bmi.toFixed(1), label: 'Bajo peso' };
  if (bmi < 25) return { value: bmi.toFixed(1), label: 'Normal' };
  if (bmi < 30) return { value: bmi.toFixed(1), label: 'Sobrepeso' };
  return { value: bmi.toFixed(1), label: 'Obesidad' };
};
