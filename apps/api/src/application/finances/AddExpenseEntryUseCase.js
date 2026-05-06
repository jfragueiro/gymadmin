const ExpenseCategoryNotFoundError = require('../../domain/finances/ExpenseCategoryNotFoundError');

class AddExpenseEntryUseCase {
  constructor({ categoryRepository, entryRepository }) {
    this.categoryRepository = categoryRepository;
    this.entryRepository = entryRepository;
  }

  async execute({ categoryId, month, label, amount }) {
    if (!label || !label.trim()) {
      throw new Error('La etiqueta es requerida');
    }
    if (!amount || Number(amount) <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new ExpenseCategoryNotFoundError(categoryId);

    return this.entryRepository.save({
      categoryId,
      month,
      label: label.trim(),
      amount: Number(amount),
    });
  }
}

module.exports = AddExpenseEntryUseCase;
