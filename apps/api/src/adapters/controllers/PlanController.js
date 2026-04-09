const {
  createPlanUseCase,
  getPlanUseCase,
  listPlansUseCase,
  updatePlanUseCase,
  softDeletePlanUseCase,
} = require('../../infrastructure/container');

class PlanController {
  async create(req, res, next) {
    try {
      const plan = await createPlanUseCase.execute(req.body);
      res.status(201).json(plan);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const plan = await getPlanUseCase.execute({ id: req.params.id });
      res.json(plan);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const plans = await listPlansUseCase.execute();
      res.json(plans);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const plan = await updatePlanUseCase.execute({ id: req.params.id, ...req.body });
      res.json(plan);
    } catch (err) {
      next(err);
    }
  }

  async softDelete(req, res, next) {
    try {
      await softDeletePlanUseCase.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlanController();
