const { z } = require('zod');

const assignPlanSchema = z.object({
  clientId: z.string().uuid(),
  planId: z.string().uuid(),
  startDate: z.string(),
});

module.exports = { assignPlanSchema };
