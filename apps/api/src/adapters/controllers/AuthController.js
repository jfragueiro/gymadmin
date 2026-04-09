const { loginUseCase, registerUserUseCase } = require('../../infrastructure/container');

class AuthController {
  async login(req, res, next) {
    try {
      const result = await loginUseCase.execute(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async registerUser(req, res, next) {
    try {
      const user = await registerUserUseCase.execute(req.body);
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
