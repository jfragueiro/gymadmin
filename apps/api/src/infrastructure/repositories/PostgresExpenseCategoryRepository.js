const knex = require('../db/knex');

class PostgresExpenseCategoryRepository {
  async findAll() {
    return knex('expense_categories').orderBy('created_at', 'asc');
  }

  async findById(id) {
    return knex('expense_categories').where({ id }).first() || null;
  }

  async save({ name }) {
    const [row] = await knex('expense_categories').insert({ name }).returning('*');
    return row;
  }
}

module.exports = PostgresExpenseCategoryRepository;
