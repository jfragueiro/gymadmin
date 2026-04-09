const { Router } = require('express');
const paymentController = require('../controllers/PaymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/', authMiddleware, (req, res, next) => paymentController.register(req, res, next));
router.get('/client/:clientId', authMiddleware, (req, res, next) => paymentController.getByClient(req, res, next));

module.exports = router;
