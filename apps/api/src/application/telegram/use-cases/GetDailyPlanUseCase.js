function formatDayMessage(client, plan, day, dayName) {
  const lines = [
    `*GymAdmin* — Tu plan para hoy, ${dayName}`,
    `Hola ${client.name} 👋  Plan: *${plan.name}*`,
    '',
  ];

  day.exercises.forEach((ex, i) => {
    const peso = ex.weightKg ? ` — ${ex.weightKg}kg` : '';
    lines.push(`${i + 1}. ${ex.name} — ${ex.sets}x${ex.reps}${peso} — desc. ${ex.restSeconds}s`);
  });

  lines.push('', '💪 ¡A entrenar!');
  return lines.join('\n');
}

class GetDailyPlanUseCase {
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

    const today = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      timeZone: process.env.GYM_TIMEZONE,
    });
    const dayName = today.charAt(0).toUpperCase() + today.slice(1);

    const plan = await this.trainingPlanRepository.findActiveByClientId(client.id);

    if (!plan) {
      await this.telegramService.sendMessage(
        chatId,
        'No tenés un plan de entrenamiento activo. Consultá a tu profesor.'
      );
      return;
    }

    const day = plan.days?.find((d) => d.dayName === dayName);

    if (!day || day.exercises.length === 0) {
      await this.telegramService.sendMessage(
        chatId,
        '🔆 Hoy es tu día de descanso. ¡Recupérate y volvé mañana con todo!'
      );
      return;
    }

    const msg = formatDayMessage(client, plan, day, dayName);
    await this.telegramService.sendMessage(chatId, msg);
  }
}

module.exports = GetDailyPlanUseCase;
