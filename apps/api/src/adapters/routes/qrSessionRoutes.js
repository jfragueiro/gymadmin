const { Router } = require('express');
const qrSessionController = require('../controllers/QRSessionController');
const validateSchema = require('../middleware/validateSchema');
const { requestQRSchema } = require('../schemas/qrSessionSchema');

const router = Router();

// Todos públicos — el cliente no tiene JWT
router.post('/request', validateSchema(requestQRSchema), (req, res, next) =>
  qrSessionController.request(req, res, next)
);

router.get('/status/:token', (req, res, next) =>
  qrSessionController.status(req, res, next)
);

router.get('/validate/:token', (req, res, next) =>
  qrSessionController.validate(req, res, next)
);

module.exports = router;
