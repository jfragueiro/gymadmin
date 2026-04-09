const { Router } = require('express');
const authController = require('../controllers/AuthController');
const validateSchema = require('../middleware/validateSchema');
const { loginSchema, registerUserSchema } = require('../schemas/authSchema');

const router = Router();

router.post('/login', validateSchema(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/register', validateSchema(registerUserSchema), (req, res, next) => authController.registerUser(req, res, next));

module.exports = router;
