const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

class GetWeeklyPlanUseCase {
  constructor({ clientRepository, trainingPlanRepository, telegramService }) {
    this.clientRepository = clientRepository;
    this.trainingPlanRepository = trainingPlanRepository;
    this.telegramService = telegramService;
  }

  async execute({ chatId }) {
    const client = await this.clientRepository.findByTelegramChatId(chatId);

    if (!client) {
      await this.telegramService.sendMessage(
        chatId,
        'Tu cuenta no está vinculada. Escribí tu DNI para vincularla.'
      );
      return;
    }

    const plan = await this.trainingPlanRepository.findActiveByClientId(client.id);

    if (!plan) {
      await this.telegramService.sendMessage(
        chatId,
        'No tenés un plan activo. Consultá a tu profesor.'
      );
      return;
    }

    const lines = [`📅 *${plan.name}* — Plan semanal\n`];

    for (const dayName of DAYS) {
      const day = plan.days?.find((d) => d.dayName === dayName);

      if (!day || day.exercises.length === 0) {
        lines.push(`*${dayName}*: 🔆 Descanso`);
      } else {
        lines.push(`*${dayName}*:`);
        day.exercises.forEach((ex, i) => {
          const peso = ex.weightKg ? ` ${ex.weightKg}kg` : '';
          lines.push(`  ${i + 1}. ${ex.name} — ${ex.sets}x${ex.reps}${peso}`);
        });
      }

      lines.push('');
    }

    await this.telegramService.sendMessage(chatId, lines.join('\n'));
  }
}

module.exports = GetWeeklyPlanUseCase;
