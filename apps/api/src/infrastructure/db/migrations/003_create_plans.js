exports.up = function (knex) {
  return knex.schema.createTable('plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.integer('duration_days').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('plans');
};
