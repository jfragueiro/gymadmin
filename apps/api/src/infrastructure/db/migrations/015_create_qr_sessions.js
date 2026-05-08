exports.up = function (knex) {
  return knex.schema.createTable('qr_sessions', (table) => {
    table.increments('id').primary();
    table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
    table.string('token', 255).notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.timestamp('used_at').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('qr_sessions');
};
