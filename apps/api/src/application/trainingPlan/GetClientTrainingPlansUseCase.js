class GetClientTrainingPlansUseCase {
  constructor({ trainingPlanRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
  }

  async execute({ clientId }) {
    return this.trainingPlanRepository.findByClientId(clientId);
  }
}

module.exports = GetClientTrainingPlansUseCase;
