const { randomUUID } = require('crypto');
const mockClients = require('../../../../mock/clients');

exports.seed = async function (knex) {
  if (process.env.ENVIRONMENT === 'production') return;

  const [{ count }] = await knex('clients').count('id as count');
  if (parseInt(count) > 0) return;

  const rows = mockClients.map((c) => ({
    ...c,
    is_active: true,
    qr_token: randomUUID(),
  }));

  await knex('clients').insert(rows);
};
