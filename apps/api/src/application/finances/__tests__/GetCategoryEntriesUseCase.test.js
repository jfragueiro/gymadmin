const GetCategoryEntriesUseCase = require('../GetCategoryEntriesUseCase');
const ExpenseCategoryNotFoundError = require('../../../domain/finances/ExpenseCategoryNotFoundError');

describe('GetCategoryEntriesUseCase', () => {
  let categoryRepository;
  let entryRepository;
  let useCase;

  beforeEach(() => {
    categoryRepository = { findById: jest.fn() };
    entryRepository = { findByMonthAndCategory: jest.fn() };
    useCase = new GetCategoryEntriesUseCase({ categoryRepository, entryRepository });
    jest.clearAllMocks();
  });

  it('retorna las entradas del mes con total calculado', async () => {
    categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Empleados' });
    entryRepository.findByMonthAndCategory.mockResolvedValue([
      { id: 1, label: 'Juan Pérez', amount: 350000 },
      { id: 2, label: 'Ana Gómez', amount: 280000 },
    ]);

    const result = await useCase.execute({ categoryId: 1, month: '2026-05' });

    expect(result.category.name).toBe('Empleados');
    expect(result.entries).toHaveLength(2);
    expect(result.total).toBe(630000);
    expect(result.month).toBe('2026-05');
  });

  it('retorna total 0 cuando el mes no tiene entradas', async () => {
    categoryRepository.findById.mockResolvedValue({ id: 2, name: 'Servicios' });
    entryRepository.findByMonthAndCategory.mockResolvedValue([]);

    const result = await useCase.execute({ categoryId: 2, month: '2026-03' });

    expect(result.entries).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('lanza ExpenseCategoryNotFoundError si la categoría no existe', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ categoryId: 99, month: '2026-05' })
    ).rejects.toBeInstanceOf(ExpenseCategoryNotFoundError);
  });
});
