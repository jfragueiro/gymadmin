const knex = require('../db/knex');

class PostgresExpenseEntryRepository {
  async findByMonthAndCategory(month, categoryId) {
    return knex('expense_entries')
      .where({ month, category_id: categoryId })
      .orderBy('created_at', 'asc')
      .select('id', 'category_id as categoryId', 'month', 'label', 'amount');
  }

  async getSummaryByYear(year) {
    const rows = await knex('expense_entries')
      .whereRaw("month LIKE ?", [`${year}-%`])
      .groupBy('month', 'category_id')
      .select('month', 'category_id as categoryId', knex.raw('SUM(amount) as total'));
    return rows.map((r) => ({ month: r.month, categoryId: r.categoryId, total: Number(r.total) }));
  }

  async save({ categoryId, month, label, amount }) {
    const [row] = await knex('expense_entries')
      .insert({ category_id: categoryId, month, label, amount })
      .returning('*');
    return {
      id: row.id,
      categoryId: row.category_id,
      month: row.month,
      label: row.label,
      amount: Number(row.amount),
    };
  }

  async deleteById(id) {
    await knex('expense_entries').where({ id }).delete();
  }
}

module.exports = PostgresExpenseEntryRepository;
