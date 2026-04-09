const {
  createTrainingPlanUseCase,
  getClientTrainingPlansUseCase,
  updateTrainingPlanUseCase,
  deleteTrainingPlanUseCase,
  addExerciseUseCase,
  removeExerciseUseCase,
} = require('../../infrastructure/container');

class TrainingPlanController {
  async getByClient(req, res, next) {
    try {
      const plans = await getClientTrainingPlansUseCase.execute({ clientId: req.params.clientId });
      res.json(plans);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const plan = await createTrainingPlanUseCase.execute(req.body);
      res.status(201).json(plan);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const plan = await updateTrainingPlanUseCase.execute({ id: req.params.id, ...req.body });
      res.json(plan);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await deleteTrainingPlanUseCase.execute({ id: req.params.id });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async addExercise(req, res, next) {
    try {
      const exercise = await addExerciseUseCase.execute({ planId: req.params.id, ...req.body });
      res.status(201).json(exercise);
    } catch (err) {
      next(err);
    }
  }

  async removeExercise(req, res, next) {
    try {
      await removeExerciseUseCase.execute({ exerciseId: req.params.exerciseId });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TrainingPlanController();
