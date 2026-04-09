const knexLib = require('knex');

const knex = knexLib({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

module.exports = knex;
