const { Router } = require('express');
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize.middleware');
const validateSchema = require('../middleware/validateSchema');
const {
  createUserSchema,
  updateUserSchema,
  updateOwnProfileSchema,
  toggleStatusSchema,
} = require('../schemas/userSchema');

const router = Router();

// Own profile — any authenticated role
router.get('/me', authMiddleware, (req, res, next) => userController.me(req, res, next));
router.put('/me', authMiddleware, validateSchema(updateOwnProfileSchema), (req, res, next) => userController.updateMe(req, res, next));

// User management — admin only
router.get('/', authMiddleware, authorize('users', 'full'), (req, res, next) => userController.list(req, res, next));
router.post('/', authMiddleware, authorize('users', 'full'), validateSchema(createUserSchema), (req, res, next) => userController.create(req, res, next));
router.put('/:id', authMiddleware, authorize('users', 'full'), validateSchema(updateUserSchema), (req, res, next) => userController.update(req, res, next));
router.patch('/:id/status', authMiddleware, authorize('users', 'full'), validateSchema(toggleStatusSchema), (req, res, next) => userController.toggleStatus(req, res, next));

module.exports = router;
