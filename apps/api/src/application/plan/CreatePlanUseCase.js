const Plan = require('../../domain/plan/Plan');

class CreatePlanUseCase {
  constructor({ planRepository }) {
    this.planRepository = planRepository;
  }

  async execute({ name, description, price, durationDays }) {
    const plan = Plan.create({ name, description, price, durationDays });
    await this.planRepository.save(plan);
    return plan;
  }
}

module.exports = CreatePlanUseCase;
