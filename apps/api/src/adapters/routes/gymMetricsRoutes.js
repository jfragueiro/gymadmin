const { Router } = require('express');
const gymMetricsController = require('../controllers/GymMetricsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/', authMiddleware, (req, res, next) =>
  gymMetricsController.getMetrics(req, res, next)
);

module.exports = router;
