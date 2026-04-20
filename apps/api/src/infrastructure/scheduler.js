const cron = require('node-cron');

function startScheduler(container) {
  cron.schedule(
    '0 7 * * *',
    async () => {
      console.log('Running SendDailyPlansUseCase');
      await container.sendDailyPlansUseCase.execute();
    },
    { timezone: process.env.GYM_TIMEZONE || 'America/Buenos_Aires' }
  );
}

module.exports = { startScheduler };
