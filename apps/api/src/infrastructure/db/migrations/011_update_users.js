exports.up = async (knex) => {
  await knex.schema.alterTable('users', (t) => {
    t.string('name').nullable();
    t.timestamp('last_login_at').nullable();
    t.string('password_reset_token').nullable();
    t.timestamp('password_reset_expires').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumn('name');
    t.dropColumn('last_login_at');
    t.dropColumn('password_reset_token');
    t.dropColumn('password_reset_expires');
  });
};
