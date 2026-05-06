const { z } = require('zod');

const monthRegex = /^\d{4}-\d{2}$/;

const summaryQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100).optional(),
});

const categoryEntriesQuerySchema = z.object({
  month: z.string().regex(monthRegex, 'month debe tener formato YYYY-MM'),
});

const addCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

const addEntrySchema = z.object({
  month: z.string().regex(monthRegex, 'month debe tener formato YYYY-MM'),
  label: z.string().min(1, 'La etiqueta es requerida'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
});

module.exports = { summaryQuerySchema, categoryEntriesQuerySchema, addCategorySchema, addEntrySchema };
