const { Router } = require('express');
const financesController = require('../controllers/FinancesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/summary',                             authMiddleware, (req, res, next) => financesController.getSummary(req, res, next));
router.get('/categories/:categoryId/entries',      authMiddleware, (req, res, next) => financesController.getCategoryEntries(req, res, next));
router.post('/categories',                         authMiddleware, (req, res, next) => financesController.addCategory(req, res, next));
router.post('/categories/:categoryId/entries',     authMiddleware, (req, res, next) => financesController.addEntry(req, res, next));
router.delete('/entries/:entryId',                 authMiddleware, (req, res, next) => financesController.deleteEntry(req, res, next));

module.exports = router;
