const { z } = require('zod');

const createPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  durationDays: z.number().int().positive(),
});

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  durationDays: z.number().int().positive().optional(),
});

module.exports = { createPlanSchema, updatePlanSchema };
