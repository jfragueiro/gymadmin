const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  const passwordHash = await bcrypt.hash('postgres', 10);

  await knex('users').delete();

  await knex('users').insert([
    {
      email: 'admin@gymadmin.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
    },
  ]);
};
