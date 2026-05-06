class GetFinancialSummaryUseCase {
  constructor({ categoryRepository, entryRepository }) {
    this.categoryRepository = categoryRepository;
    this.entryRepository = entryRepository;
  }

  async execute({ year } = {}) {
    const targetYear = year || new Date().getFullYear();

    const [categories, summaryRows] = await Promise.all([
      this.categoryRepository.findAll(),
      this.entryRepository.getSummaryByYear(targetYear),
    ]);

    // Build lookup: { 'YYYY-MM': { categoryId: total } }
    const lookup = {};
    for (const row of summaryRows) {
      if (!lookup[row.month]) lookup[row.month] = {};
      lookup[row.month][row.categoryId] = Number(row.total);
    }

    const months = this._generateMonths(targetYear).map((month) => {
      const monthData = lookup[month] || {};
      const totals = {};
      let grandTotal = 0;

      for (const cat of categories) {
        const val = monthData[cat.id] !== undefined ? monthData[cat.id] : null;
        totals[cat.id] = val;
        if (val !== null) grandTotal += val;
      }

      return { month, totals, grandTotal };
    });

    return { year: targetYear, categories, months };
  }

  _generateMonths(year) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastMonth = year === currentYear ? now.getMonth() + 1 : 12;
    const months = [];
    for (let m = lastMonth; m >= 1; m--) {
      months.push(`${year}-${String(m).padStart(2, '0')}`);
    }
    return months;
  }
}

module.exports = GetFinancialSummaryUseCase;
