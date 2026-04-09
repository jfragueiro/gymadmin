const { Router } = require('express');
const clientRoutes = require('./clientRoutes');
const planRoutes = require('./planRoutes');
const membershipRoutes = require('./membershipRoutes');
const authRoutes = require('./authRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const paymentRoutes = require('./paymentRoutes');
const qrRoutes = require('./qrRoutes');
const trainingPlanRoutes = require('./trainingPlanRoutes');
const trainingPlanController = require('../controllers/TrainingPlanController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use('/clients', clientRoutes);
router.get('/clients/:clientId/training-plans', authMiddleware, (req, res, next) =>
  trainingPlanController.getByClient(req, res, next)
);
router.use('/plans', planRoutes);
router.use('/memberships', membershipRoutes);
router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payments', paymentRoutes);
router.use('/training-plans', trainingPlanRoutes);
router.use('/', qrRoutes);

module.exports = router;
