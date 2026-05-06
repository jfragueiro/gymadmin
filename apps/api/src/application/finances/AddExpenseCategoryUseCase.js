class AddExpenseCategoryUseCase {
  constructor({ categoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async execute({ name } = {}) {
    if (!name || !name.trim()) {
      throw new Error('El nombre de la categoría es requerido');
    }
    return this.categoryRepository.save({ name: name.trim() });
  }
}

module.exports = AddExpenseCategoryUseCase;
