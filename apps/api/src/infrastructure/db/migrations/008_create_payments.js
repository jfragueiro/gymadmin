exports.up = function (knex) {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.uuid('membership_id').notNullable().references('id').inTable('memberships').onDelete('CASCADE');
    table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.date('payment_date').notNullable().defaultTo(knex.fn.now());
    table.string('method').notNullable().defaultTo('cash'); // cash | card | transfer
    table.string('reference');
    table.text('notes');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('payments');
};
