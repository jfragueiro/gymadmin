exports.up = function (knex) {
  return knex.schema.alterTable('attendance', (table) => {
    table.string('method').notNullable().defaultTo('manual');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('attendance', (table) => {
    table.dropColumn('method');
  });
};
