const PlanNotFoundError = require('../../domain/plan/PlanNotFoundError');

class SoftDeletePlanUseCase {
  constructor({ planRepository }) {
    this.planRepository = planRepository;
  }

  async execute({ id }) {
    const plan = await this.planRepository.findById(id);
    if (!plan) throw new PlanNotFoundError(id);

    plan.isActive = false;
    await this.planRepository.update(plan);
    return plan;
  }
}

module.exports = SoftDeletePlanUseCase;
