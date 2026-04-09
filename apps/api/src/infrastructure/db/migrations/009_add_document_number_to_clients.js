exports.up = function (knex) {
  return knex.schema.alterTable('clients', (table) => {
    table.string('document_number').nullable();
    table.index('document_number');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('clients', (table) => {
    table.dropIndex('document_number');
    table.dropColumn('document_number');
  });
};
