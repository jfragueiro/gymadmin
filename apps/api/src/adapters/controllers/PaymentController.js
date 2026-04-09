const { registerPaymentUseCase, getClientPaymentsUseCase } = require('../../infrastructure/container');

class PaymentController {
  async register(req, res, next) {
    try {
      const payment = await registerPaymentUseCase.execute(req.body);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  }

  async getByClient(req, res, next) {
    try {
      const payments = await getClientPaymentsUseCase.execute({ clientId: req.params.clientId });
      res.json(payments);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PaymentController();
