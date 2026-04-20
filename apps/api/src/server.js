require('dotenv').config();
const app = require('./app');
const { startScheduler } = require('./infrastructure/scheduler');
const container = require('./infrastructure/container');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (container.telegramService) {
    startScheduler(container);
    console.log('Telegram scheduler started');
  }
});
