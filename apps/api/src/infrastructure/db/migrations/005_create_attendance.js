exports.up = function (knex) {
  return knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary();
    table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
    table.uuid('checked_in_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('checked_in_at').notNullable().defaultTo(knex.fn.now());
    table.text('notes');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('attendance');
};
