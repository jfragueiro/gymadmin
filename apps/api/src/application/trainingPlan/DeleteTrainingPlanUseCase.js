class DeleteTrainingPlanUseCase {
  constructor({ trainingPlanRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
  }

  async execute({ id }) {
    const plan = await this.trainingPlanRepository.findById(id);
    if (!plan) throw Object.assign(new Error('Plan no encontrado'), { statusCode: 404 });
    await this.trainingPlanRepository.softDelete(id);
  }
}

module.exports = DeleteTrainingPlanUseCase;
