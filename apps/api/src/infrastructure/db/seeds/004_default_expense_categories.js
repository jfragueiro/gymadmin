exports.seed = async function (knex) {
  const existing = await knex('expense_categories').count('id as count').first();
  if (parseInt(existing.count) > 0) return;

  await knex('expense_categories').insert([
    { name: 'Empleados' },
    { name: 'Servicios' },
  ]);
};
