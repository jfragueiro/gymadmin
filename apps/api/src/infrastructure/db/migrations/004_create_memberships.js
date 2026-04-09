exports.up = function (knex) {
  return knex.schema.createTable('memberships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('client_id').notNullable().references('id').inTable('clients');
    table.uuid('plan_id').notNullable().references('id').inTable('plans');
    table.date('start_date').notNullable();
    table.date('end_date');
    table.string('status').notNullable().defaultTo('active');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('memberships');
};
