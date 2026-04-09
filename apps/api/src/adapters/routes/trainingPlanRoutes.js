const { Router } = require('express');
const trainingPlanController = require('../controllers/TrainingPlanController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const {
  createTrainingPlanSchema,
  updateTrainingPlanSchema,
  addExerciseSchema,
} = require('../schemas/trainingPlanSchema');

const router = Router();

router.post('/', authMiddleware, validateSchema(createTrainingPlanSchema), (req, res, next) =>
  trainingPlanController.create(req, res, next)
);
router.put('/:id', authMiddleware, validateSchema(updateTrainingPlanSchema), (req, res, next) =>
  trainingPlanController.update(req, res, next)
);
router.delete('/:id', authMiddleware, (req, res, next) =>
  trainingPlanController.remove(req, res, next)
);
router.post('/:id/exercises', authMiddleware, validateSchema(addExerciseSchema), (req, res, next) =>
  trainingPlanController.addExercise(req, res, next)
);
router.delete('/:id/exercises/:exerciseId', authMiddleware, (req, res, next) =>
  trainingPlanController.removeExercise(req, res, next)
);

module.exports = router;
