const PlanNotFoundError = require('../../domain/plan/PlanNotFoundError');

class GetPlanUseCase {
  constructor({ planRepository }) {
    this.planRepository = planRepository;
  }

  async execute({ id }) {
    const plan = await this.planRepository.findById(id);
    if (!plan) throw new PlanNotFoundError(id);
    return plan;
  }
}

module.exports = GetPlanUseCase;
