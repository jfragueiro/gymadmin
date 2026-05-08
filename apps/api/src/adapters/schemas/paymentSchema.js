const { z } = require('zod');

const registerPaymentSchema = z.object({
  clientId: z.string().uuid('clientId debe ser un UUID válido'),
  membershipId: z.number().int().positive('membershipId debe ser un entero positivo'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  method: z.enum(['cash', 'card', 'transfer'], {
    errorMap: () => ({ message: 'Método inválido. Opciones: cash, card, transfer' }),
  }),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato esperado: YYYY-MM-DD'),
  reference: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

module.exports = { registerPaymentSchema };
