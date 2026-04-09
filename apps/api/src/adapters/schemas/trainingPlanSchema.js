const { z } = require('zod');

const createTrainingPlanSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1),
  goal: z.string().optional(),
  notes: z.string().optional(),
});

const updateTrainingPlanSchema = z.object({
  name: z.string().min(1).optional(),
  goal: z.string().optional(),
  notes: z.string().optional(),
});

const addExerciseSchema = z.object({
  name: z.string().min(1),
  dayLabel: z.string().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.string().optional(),
  weightKg: z.number().positive().optional(),
  restSeconds: z.number().int().nonnegative().optional(),
});

module.exports = { createTrainingPlanSchema, updateTrainingPlanSchema, addExerciseSchema };
