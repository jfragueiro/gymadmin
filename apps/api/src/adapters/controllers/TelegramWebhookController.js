const {
  linkTelegramUseCase,
  getDailyPlanUseCase,
  getWeeklyPlanUseCase,
  handleUnknownCommandUseCase,
} = require('../../infrastructure/container');

class TelegramWebhookController {
  async handle(req, res) {
    const secret = req.headers['x-telegram-bot-api-secret-token'];
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      console.warn('Telegram webhook: invalid secret token attempt');
      return res.status(401).end();
    }

    // Respond immediately to Telegram (must be < 5s)
    res.status(200).end();

    const msg = req.body?.message;
    if (!msg) return;

    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();

    if (/^\d{6,10}$/.test(text)) {
      await linkTelegramUseCase.execute({ dni: text, chatId });
    } else if (text === '/plan' || text.startsWith('/plan@')) {
      await getDailyPlanUseCase.execute({ chatId });
    } else if (text === '/semana' || text.startsWith('/semana@')) {
      await getWeeklyPlanUseCase.execute({ chatId });
    } else {
      await handleUnknownCommandUseCase.execute({ chatId });
    }
  }
}

module.exports = new TelegramWebhookController();
