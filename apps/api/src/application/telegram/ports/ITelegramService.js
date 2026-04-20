class ITelegramService {
  async sendMessage(chatId, text) {
    throw new Error('Not implemented');
  }
}

module.exports = { ITelegramService };
