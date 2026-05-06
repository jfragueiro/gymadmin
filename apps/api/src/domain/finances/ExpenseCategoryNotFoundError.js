class ExpenseCategoryNotFoundError extends Error {
  constructor(id) {
    super(`Categoría de gasto no encontrada: ${id}`);
    this.name = 'ExpenseCategoryNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = ExpenseCategoryNotFoundError;
