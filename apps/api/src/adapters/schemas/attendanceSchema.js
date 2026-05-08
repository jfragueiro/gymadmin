const { z } = require('zod');

const checkInSchema = z.object({
  clientId: z.string().uuid('clientId debe ser un UUID válido'),
  notes: z.string().max(500).optional(),
});

module.exports = { checkInSchema };
