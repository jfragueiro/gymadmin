const {
  registerClientUseCase,
  getClientUseCase,
  listClientsUseCase,
  updateClientUseCase,
  softDeleteClientUseCase,
} = require('../../infrastructure/container');

class ClientController {
  async register(req, res, next) {
    try {
      const client = await registerClientUseCase.execute(req.body);
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const client = await getClientUseCase.execute({ id: req.params.id });
      res.json(client);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const result = await listClientsUseCase.execute({ page, limit, search });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const client = await updateClientUseCase.execute({ id: req.params.id, ...req.body });
      res.json(client);
    } catch (err) {
      next(err);
    }
  }

  async softDelete(req, res, next) {
    try {
      await softDeleteClientUseCase.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ClientController();
