require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/infrastructure/db/migrations',
    },
    seeds: {
      directory: './src/infrastructure/db/seeds',
    },
  },
};
