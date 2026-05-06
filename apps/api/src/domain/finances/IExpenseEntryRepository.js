class IExpenseEntryRepository {
  async findByMonthAndCategory(month, categoryId) { throw new Error('Not implemented'); }
  async getSummaryByYear(year) { throw new Error('Not implemented'); }
  async save(entry) { throw new Error('Not implemented'); }
  async deleteById(id) { throw new Error('Not implemented'); }
}

module.exports = IExpenseEntryRepository;
