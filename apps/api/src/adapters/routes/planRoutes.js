const { Router } = require('express');
const planController = require('../controllers/PlanController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { createPlanSchema, updatePlanSchema } = require('../schemas/planSchema');

const router = Router();

router.post('/', authMiddleware, validateSchema(createPlanSchema), (req, res, next) => planController.create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => planController.list(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => planController.get(req, res, next));
router.put('/:id', authMiddleware, validateSchema(updatePlanSchema), (req, res, next) => planController.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => planController.softDelete(req, res, next));

module.exports = router;
