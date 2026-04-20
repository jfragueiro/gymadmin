exports.up = async (knex) => {
  await knex.schema.alterTable('clients', (t) => {
    t.bigInteger('telegram_chat_id').nullable().unique();
    t.timestamp('telegram_linked_at').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('clients', (t) => {
    t.dropColumn('telegram_chat_id');
    t.dropColumn('telegram_linked_at');
  });
};
