const { Router } = require('express');
const qrController = require('../controllers/QRController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// Public — no auth required
router.get('/check-in/:token', (req, res, next) =>
  qrController.publicCheckIn(req, res, next)
);

// Admin — requires auth
router.get('/clients/:id/qr', authMiddleware, (req, res, next) =>
  qrController.getQR(req, res, next)
);
router.post('/clients/:id/regenerate-qr', authMiddleware, (req, res, next) =>
  qrController.regenerate(req, res, next)
);

module.exports = router;
