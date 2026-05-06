const { z } = require('zod');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const gymMetricsQuerySchema = z.object({
  startDate: z.string().regex(dateRegex, 'startDate debe tener formato YYYY-MM-DD'),
  endDate: z.string().regex(dateRegex, 'endDate debe tener formato YYYY-MM-DD'),
});

module.exports = { gymMetricsQuerySchema };
