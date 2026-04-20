const { Router } = require('express');
const telegramWebhookController = require('../controllers/TelegramWebhookController');

const router = Router();

// Public endpoint — verified with X-Telegram-Bot-Api-Secret-Token, NO JWT auth
router.post('/webhook', (req, res) => telegramWebhookController.handle(req, res));

module.exports = router;
