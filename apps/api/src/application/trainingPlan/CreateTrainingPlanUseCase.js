const TrainingPlan = require('../../domain/trainingPlan/TrainingPlan');

class CreateTrainingPlanUseCase {
  constructor({ trainingPlanRepository, clientRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId, name, goal, notes }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw Object.assign(new Error('Cliente no encontrado'), { statusCode: 404 });
    const plan = TrainingPlan.create({ clientId, name, goal, notes });
    return this.trainingPlanRepository.save(plan);
  }
}

module.exports = CreateTrainingPlanUseCase;
