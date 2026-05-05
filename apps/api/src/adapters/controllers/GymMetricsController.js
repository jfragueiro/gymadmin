const { getGymMetricsUseCase } = require('../../infrastructure/container');
const { gymMetricsQuerySchema } = require('../schemas/gymMetricsSchema');

class GymMetricsController {
  async getMetrics(req, res, next) {
    try {
      const { startDate, endDate } = gymMetricsQuerySchema.parse(req.query);
      const result = await getGymMetricsUseCase.execute({ startDate, endDate });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GymMetricsController();
