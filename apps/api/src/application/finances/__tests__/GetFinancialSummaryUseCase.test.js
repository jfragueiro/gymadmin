const GetFinancialSummaryUseCase = require('../GetFinancialSummaryUseCase');

describe('GetFinancialSummaryUseCase', () => {
  let categoryRepository;
  let entryRepository;
  let useCase;

  beforeEach(() => {
    categoryRepository = { findAll: jest.fn() };
    entryRepository = { getSummaryByYear: jest.fn() };
    useCase = new GetFinancialSummaryUseCase({ categoryRepository, entryRepository });
    jest.clearAllMocks();
  });

  it('retorna categorías y matriz de meses con totales por categoría', async () => {
    categoryRepository.findAll.mockResolvedValue([
      { id: 1, name: 'Empleados' },
      { id: 2, name: 'Servicios' },
    ]);
    entryRepository.getSummaryByYear.mockResolvedValue([
      { month: '2026-05', categoryId: 1, total: 350000 },
      { month: '2026-05', categoryId: 2, total: 51000 },
      { month: '2026-04', categoryId: 2, total: 55000 },
    ]);

    const result = await useCase.execute({ year: 2026 });

    expect(result.categories).toHaveLength(2);
    const mayo = result.months.find((m) => m.month === '2026-05');
    expect(mayo.totals[1]).toBe(350000);
    expect(mayo.totals[2]).toBe(51000);
    expect(mayo.grandTotal).toBe(401000);
  });

  it('pone null en celdas sin entradas (para mostrar botón añadir)', async () => {
    categoryRepository.findAll.mockResolvedValue([{ id: 1, name: 'Empleados' }]);
    entryRepository.getSummaryByYear.mockResolvedValue([
      { month: '2026-05', categoryId: 1, total: 100 },
    ]);

    const result = await useCase.execute({ year: 2026 });

    const abril = result.months.find((m) => m.month === '2026-04');
    expect(abril.totals[1]).toBeNull();
    expect(abril.grandTotal).toBe(0);
  });

  it('retorna lista vacía de meses si no hay categorías', async () => {
    categoryRepository.findAll.mockResolvedValue([]);
    entryRepository.getSummaryByYear.mockResolvedValue([]);

    const result = await useCase.execute({ year: 2026 });

    expect(result.categories).toHaveLength(0);
    expect(result.months.every((m) => m.grandTotal === 0)).toBe(true);
  });

  it('usa el año actual si no se especifica year', async () => {
    categoryRepository.findAll.mockResolvedValue([]);
    entryRepository.getSummaryByYear.mockResolvedValue([]);

    const result = await useCase.execute({});

    const currentYear = new Date().getFullYear();
    expect(result.year).toBe(currentYear);
  });
});
