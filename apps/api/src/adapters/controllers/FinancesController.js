const {
  getFinancialSummaryUseCase,
  getCategoryEntriesUseCase,
  addExpenseCategoryUseCase,
  addExpenseEntryUseCase,
  deleteExpenseEntryUseCase,
} = require('../../infrastructure/container');
const {
  summaryQuerySchema,
  categoryEntriesQuerySchema,
  addCategorySchema,
  addEntrySchema,
} = require('../schemas/financesSchema');

class FinancesController {
  async getSummary(req, res, next) {
    try {
      const { year } = summaryQuerySchema.parse(req.query);
      const result = await getFinancialSummaryUseCase.execute({ year });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getCategoryEntries(req, res, next) {
    try {
      const { month } = categoryEntriesQuerySchema.parse(req.query);
      const categoryId = parseInt(req.params.categoryId);
      const result = await getCategoryEntriesUseCase.execute({ categoryId, month });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async addCategory(req, res, next) {
    try {
      const { name } = addCategorySchema.parse(req.body);
      const result = await addExpenseCategoryUseCase.execute({ name });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async addEntry(req, res, next) {
    try {
      const { month, label, amount } = addEntrySchema.parse(req.body);
      const categoryId = parseInt(req.params.categoryId);
      const result = await addExpenseEntryUseCase.execute({ categoryId, month, label, amount });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteEntry(req, res, next) {
    try {
      await deleteExpenseEntryUseCase.execute({ entryId: parseInt(req.params.entryId) });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FinancesController();
