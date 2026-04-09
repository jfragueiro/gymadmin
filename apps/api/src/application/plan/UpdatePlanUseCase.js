const PlanNotFoundError = require('../../domain/plan/PlanNotFoundError');

class UpdatePlanUseCase {
  constructor({ planRepository }) {
    this.planRepository = planRepository;
  }

  async execute({ id, name, description, price, durationDays }) {
    const plan = await this.planRepository.findById(id);
    if (!plan) throw new PlanNotFoundError(id);

    if (name !== undefined) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (durationDays !== undefined) plan.durationDays = durationDays;

    await this.planRepository.update(plan);
    return plan;
  }
}

module.exports = UpdatePlanUseCase;
