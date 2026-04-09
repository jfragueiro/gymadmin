const { Router } = require('express');
const clientController = require('../controllers/ClientController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { registerClientSchema, updateClientSchema } = require('../schemas/clientSchema');

const router = Router();

router.post('/', authMiddleware, validateSchema(registerClientSchema), (req, res, next) => clientController.register(req, res, next));
router.get('/', authMiddleware, (req, res, next) => clientController.list(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => clientController.get(req, res, next));
router.put('/:id', authMiddleware, validateSchema(updateClientSchema), (req, res, next) => clientController.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => clientController.softDelete(req, res, next));

module.exports = router;
