const TelegramBot = require('node-telegram-bot-api');

class TelegramBotService {
  constructor(token) {
    // Webhook mode — no polling
    this.bot = new TelegramBot(token, { webHook: false });
  }

  async sendMessage(chatId, text) {
    return this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }
}

module.exports = TelegramBotService;
