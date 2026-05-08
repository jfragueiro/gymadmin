const { Router } = require('express');
const attendanceController = require('../controllers/AttendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { checkInSchema } = require('../schemas/attendanceSchema');

const router = Router();

router.post('/checkin', authMiddleware, validateSchema(checkInSchema), (req, res, next) =>
  attendanceController.checkIn(req, res, next)
);
router.get('/daily', authMiddleware, (req, res, next) =>
  attendanceController.getDaily(req, res, next)
);
router.get('/client/:clientId', authMiddleware, (req, res, next) =>
  attendanceController.getByClient(req, res, next)
);

module.exports = router;
