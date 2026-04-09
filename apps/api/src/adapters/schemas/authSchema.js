const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'staff']).optional(),
});

module.exports = { loginSchema, registerUserSchema };
