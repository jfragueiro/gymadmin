exports.up = async (knex) => {
  await knex.schema.createTable('training_plans', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
    t.string('name').notNullable();
    t.string('goal');
    t.text('notes');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('training_exercises', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('training_plan_id').notNullable().references('id').inTable('training_plans').onDelete('CASCADE');
    t.string('name').notNullable();
    t.string('day_label');
    t.integer('sets');
    t.string('reps');
    t.decimal('weight_kg', 6, 2);
    t.integer('rest_seconds');
    t.integer('order_index').notNullable().defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('training_exercises');
  await knex.schema.dropTableIfExists('training_plans');
};
