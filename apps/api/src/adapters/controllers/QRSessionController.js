const {
  requestQRSessionUseCase,
  validateQRSessionUseCase,
  getQRSessionStatusUseCase,
} = require('../../infrastructure/container');

class QRSessionController {
  async request(req, res, next) {
    try {
      const { documentNumber } = req.body;
      const result = await requestQRSessionUseCase.execute({ documentNumber });
      res.status(result.isExisting ? 200 : 201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async validate(req, res, next) {
    try {
      const { token } = req.params;
      const result = await validateQRSessionUseCase.execute({ token });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async status(req, res, next) {
    try {
      const { token } = req.params;
      const result = await getQRSessionStatusUseCase.execute({ token });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new QRSessionController();
