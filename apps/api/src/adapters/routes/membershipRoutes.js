const { Router } = require('express');
const membershipController = require('../controllers/MembershipController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { assignPlanSchema } = require('../schemas/membershipSchema');

const router = Router();

router.get('/overview', authMiddleware, (req, res, next) => membershipController.getAllWithMembership(req, res, next));
router.post('/assign', authMiddleware, validateSchema(assignPlanSchema), (req, res, next) => membershipController.assign(req, res, next));
router.get('/client/:clientId', authMiddleware, (req, res, next) => membershipController.getByClient(req, res, next));

module.exports = router;
