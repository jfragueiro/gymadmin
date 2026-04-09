const knex = require('../db/knex');
const Plan = require('../../domain/plan/Plan');

function toEntity(row) {
  return new Plan({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    durationDays: row.duration_days,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresPlanRepository {
  async findById(id) {
    const row = await knex('plans').where({ id }).first();
    return row ? toEntity(row) : null;
  }

  async findAll() {
    const rows = await knex('plans').where({ is_active: true }).orderBy('created_at', 'desc');
    return rows.map(toEntity);
  }

  async save(plan) {
    const [row] = await knex('plans')
      .insert({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.durationDays,
        is_active: plan.isActive,
      })
      .returning('*');
    Object.assign(plan, toEntity(row));
    return plan;
  }

  async update(plan) {
    const [row] = await knex('plans')
      .where({ id: plan.id })
      .update({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.durationDays,
        is_active: plan.isActive,
        updated_at: knex.fn.now(),
      })
      .returning('*');
    Object.assign(plan, toEntity(row));
    return plan;
  }

  async softDelete(id) {
    await knex('plans').where({ id }).update({ is_active: false, updated_at: knex.fn.now() });
  }
}

module.exports = PostgresPlanRepository;
