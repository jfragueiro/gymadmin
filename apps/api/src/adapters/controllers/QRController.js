const {
  qrCheckInUseCase,
  getClientQRUseCase,
  regenerateQRTokenUseCase,
} = require('../../infrastructure/container');

class QRController {
  async publicCheckIn(req, res, next) {
    try {
      const { token } = req.params;
      const result = await qrCheckInUseCase.execute({ qrToken: token });
      res.json({
        success: true,
        clientName: result.client.name,
        checkedInAt: result.record.checkedInAt,
      });
    } catch (err) {
      next(err);
    }
  }

  async getQR(req, res, next) {
    try {
      const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
      const result = await getClientQRUseCase.execute({
        clientId: req.params.id,
        baseUrl,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async regenerate(req, res, next) {
    try {
      const result = await regenerateQRTokenUseCase.execute({ clientId: req.params.id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new QRController();
