const { z } = require('zod');

const registerClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  documentNumber: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
});

const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  documentNumber: z.string().optional(),
});

module.exports = { registerClientSchema, updateClientSchema };
