class AddExerciseUseCase {
  constructor({ trainingPlanRepository }) {
    this.trainingPlanRepository = trainingPlanRepository;
  }

  async execute({ planId, name, dayLabel, sets, reps, weightKg, restSeconds, orderIndex }) {
    const plan = await this.trainingPlanRepository.findById(planId);
    if (!plan) throw Object.assign(new Error('Plan no encontrado'), { statusCode: 404 });
    return this.trainingPlanRepository.addExercise(planId, {
      name,
      dayLabel,
      sets,
      reps,
      weightKg,
      restSeconds,
      orderIndex: orderIndex ?? plan.exercises.length,
    });
  }
}

module.exports = AddExerciseUseCase;
