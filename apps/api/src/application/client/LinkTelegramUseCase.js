class LinkTelegramUseCase {
  constructor({ clientRepository, telegramService }) {
    this.clientRepository = clientRepository;
    this.telegramService = telegramService;
  }

  async execute({ dni, chatId }) {
    const cleanDni = String(dni).replace(/\D/g, '').trim();
    const client = await this.clientRepository.findByDocumentNumber(cleanDni);

    if (!client) {
      await this.telegramService.sendMessage(chatId, 'No encontramos ninguna cuenta con ese DNI. Consultá al gym.');
      return;
    }

    if (client.status !== undefined && client.status !== 'active') {
      await this.telegramService.sendMessage(chatId, 'Tu cuenta no está activa. Consultá al gym.');
      return;
    }

    if (!client.isActive) {
      await this.telegramService.sendMessage(chatId, 'Tu cuenta no está activa. Consultá al gym.');
      return;
    }

    if (client.telegramChatId === String(chatId)) {
      await this.telegramService.sendMessage(
        chatId,
        '✅ Tu cuenta ya estaba vinculada. Escribí /plan o /semana.'
      );
      return;
    }

    await this.clientRepository.saveTelegramChatId(client.id, chatId);

    await this.telegramService.sendMessage(
      chatId,
      `✅ ¡Listo, ${client.name}! Recibirás tu plan cada día a las 7am.\n` +
        'Escribí /plan para ver el entrenamiento de hoy\n' +
        'o /semana para ver el plan completo.'
    );
  }
}

module.exports = LinkTelegramUseCase;
