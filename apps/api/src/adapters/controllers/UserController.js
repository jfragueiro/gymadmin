const {
  listUsersUseCase,
  createUserUseCase,
  updateUserUseCase,
  toggleUserStatusUseCase,
  updateOwnProfileUseCase,
  getUserUseCase,
} = require('../../infrastructure/container');

class UserController {
  async list(req, res, next) {
    try {
      const { role, isActive } = req.query;
      const filters = {};
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      const users = await listUsersUseCase.execute(filters);
      res.json(users.map(safeUser));
    } catch (err) { next(err); }
  }

  async create(req, res, next) {
    try {
      const user = await createUserUseCase.execute(req.body);
      res.status(201).json(safeUser(user));
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const user = await updateUserUseCase.execute({
        id: req.params.id,
        requesterId: req.user.sub,
        ...req.body,
      });
      res.json(safeUser(user));
    } catch (err) { next(err); }
  }

  async toggleStatus(req, res, next) {
    try {
      const user = await toggleUserStatusUseCase.execute({
        id: req.params.id,
        requesterId: req.user.sub,
        isActive: req.body.isActive,
      });
      res.json(safeUser(user));
    } catch (err) { next(err); }
  }

  async me(req, res, next) {
    try {
      const user = await getUserUseCase.execute({ id: req.user.sub });
      res.json(safeUser(user));
    } catch (err) { next(err); }
  }

  async updateMe(req, res, next) {
    try {
      const user = await updateOwnProfileUseCase.execute({
        id: req.user.sub,
        ...req.body,
      });
      res.json(safeUser(user));
    } catch (err) { next(err); }
  }
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

module.exports = new UserController();
