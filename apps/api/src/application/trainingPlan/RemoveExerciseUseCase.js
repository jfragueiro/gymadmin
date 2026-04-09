class RemoveExerciseUseCase {
  constructor({ trainingPlanRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
  }

  async execute({ exerciseId }) {
    await this.trainingPlanRepository.removeExercise(exerciseId);
  }
}

module.exports = RemoveExerciseUseCase;
