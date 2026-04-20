const logger = console;

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

class SendDailyPlansUseCase {
  constructor({ clientRepository, trainingPlanRepository, telegramService }) {
    this.clientRepository = clientRepository;
    this.trainingPlanRepository = trainingPlanRepository;
    this.telegramService = telegramService;
  }

  async execute() {
    const today = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      timeZone: process.env.GYM_TIMEZONE,
    });
    const dayName = today.charAt(0).toUpperCase() + today.slice(1);

    const clients = await this.clientRepository.findActiveWithTelegram();

    for (const client of clients) {
      try {
        const plan = await this.trainingPlanRepository.findActiveByClientId(client.id);

        if (!plan) {
          continue;
        }

        const day = plan.days?.find((d) => d.dayName === dayName);

        if (!day || day.exercises.length === 0) {
          await this.telegramService.sendMessage(
            client.telegramChatId,
            '🔆 Hoy es tu día de descanso. ¡Recupérate y volvé mañana con todo!'
          );
          continue;
        }

        const msg = formatDayMessage(client, plan, day, dayName);
        await this.telegramService.sendMessage(client.telegramChatId, msg);
      } catch (err) {
        logger.error({ clientId: client.id, err }, 'Telegram send failed');
      }
    }
  }
}

module.exports = SendDailyPlansUseCase;
