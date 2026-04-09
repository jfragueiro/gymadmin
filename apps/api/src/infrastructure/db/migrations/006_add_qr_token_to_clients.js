exports.up = function (knex) {
  return knex.schema.alterTable('clients', (table) => {
    table.uuid('qr_token').unique().defaultTo(knex.raw('gen_random_uuid()'));
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('clients', (table) => {
    table.dropColumn('qr_token');
  });
};
