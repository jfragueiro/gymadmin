const ExpenseCategoryNotFoundError = require('../../domain/finances/ExpenseCategoryNotFoundError');

class GetCategoryEntriesUseCase {
  constructor({ categoryRepository, entryRepository }) {
    this.categoryRepository = categoryRepository;
    this.entryRepository = entryRepository;
  }

  async execute({ categoryId, month }) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new ExpenseCategoryNotFoundError(categoryId);

    const entries = await this.entryRepository.findByMonthAndCategory(month, categoryId);
    const total = entries.reduce((sum, e) => sum + Number(e.amount), 0);

    return { category, month, entries, total };
  }
}

module.exports = GetCategoryEntriesUseCase;
