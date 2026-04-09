const { Router } = require('express');
const attendanceController = require('../controllers/AttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/checkin', authMiddleware, (req, res, next) =>
  attendanceController.checkIn(req, res, next)
);
router.get('/daily', authMiddleware, (req, res, next) =>
  attendanceController.getDaily(req, res, next)
);
router.get('/client/:clientId', authMiddleware, (req, res, next) =>
  attendanceController.getByClient(req, res, next)
);

module.exports = router;
