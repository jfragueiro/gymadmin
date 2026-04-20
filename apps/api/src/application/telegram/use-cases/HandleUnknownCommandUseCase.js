class HandleUnknownCommandUseCase {
  constructor({ telegramService }) {
    this.telegramService = telegramService;
  }

  async execute({ chatId }) {
    await this.telegramService.sendMessage(
      chatId,
      'No entendí ese mensaje. Escribí /plan para ver tu entrenamiento de hoy o /semana para ver el plan completo.'
    );
  }
}

module.exports = HandleUnknownCommandUseCase;
