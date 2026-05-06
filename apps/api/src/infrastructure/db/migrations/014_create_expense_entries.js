exports.up = function (knex) {
  return knex.schema.createTable('expense_entries', (table) => {
    table.increments('id').primary();
    table.integer('category_id').notNullable().references('id').inTable('expense_categories').onDelete('CASCADE');
    table.string('month', 7).notNullable(); // YYYY-MM
    table.string('label').notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('expense_entries');
};
