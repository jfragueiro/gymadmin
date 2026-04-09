class UpdateTrainingPlanUseCase {
  constructor({ trainingPlanRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
  }

  async execute({ id, name, goal, notes }) {
    const plan = await this.trainingPlanRepository.findById(id);
    if (!plan) throw Object.assign(new Error('Plan no encontrado'), { statusCode: 404 });
    if (name !== undefined) plan.name = name;
    if (goal !== undefined) plan.goal = goal;
    if (notes !== undefined) plan.notes = notes;
    return this.trainingPlanRepository.update(plan);
  }
}

module.exports = UpdateTrainingPlanUseCase;
