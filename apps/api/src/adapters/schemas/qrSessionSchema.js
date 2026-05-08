const { z } = require('zod');

const requestQRSchema = z.object({
  documentNumber: z.string().min(6, 'El documento debe tener al menos 6 caracteres').max(20),
});

module.exports = { requestQRSchema };
