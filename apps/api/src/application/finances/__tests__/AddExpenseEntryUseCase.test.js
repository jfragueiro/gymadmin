const AddExpenseEntryUseCase = require('../AddExpenseEntryUseCase');
const ExpenseCategoryNotFoundError = require('../../../domain/finances/ExpenseCategoryNotFoundError');

describe('AddExpenseEntryUseCase', () => {
  let categoryRepository;
  let entryRepository;
  let useCase;

  beforeEach(() => {
    categoryRepository = { findById: jest.fn() };
    entryRepository = { save: jest.fn() };
    useCase = new AddExpenseEntryUseCase({ categoryRepository, entryRepository });
    jest.clearAllMocks();
  });

  it('guarda y retorna la nueva entrada', async () => {
    categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Empleados' });
    entryRepository.save.mockResolvedValue({ id: 10, categoryId: 1, month: '2026-05', label: 'Juan Pérez', amount: 350000 });

    const result = await useCase.execute({
      categoryId: 1, month: '2026-05', label: 'Juan Pérez', amount: 350000,
    });

    expect(entryRepository.save).toHaveBeenCalledWith({
      categoryId: 1, month: '2026-05', label: 'Juan Pérez', amount: 350000,
    });
    expect(result.id).toBe(10);
  });

  it('lanza ExpenseCategoryNotFoundError si la categoría no existe', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ categoryId: 99, month: '2026-05', label: 'Luz', amount: 5000 })
    ).rejects.toBeInstanceOf(ExpenseCategoryNotFoundError);

    expect(entryRepository.save).not.toHaveBeenCalled();
  });

  it('lanza error si el monto es menor o igual a 0', async () => {
    categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Empleados' });

    await expect(
      useCase.execute({ categoryId: 1, month: '2026-05', label: 'Luz', amount: 0 })
    ).rejects.toThrow();

    expect(entryRepository.save).not.toHaveBeenCalled();
  });

  it('lanza error si la etiqueta está vacía', async () => {
    categoryRepository.findById.mockResolvedValue({ id: 1, name: 'Empleados' });

    await expect(
      useCase.execute({ categoryId: 1, month: '2026-05', label: '', amount: 1000 })
    ).rejects.toThrow();

    expect(entryRepository.save).not.toHaveBeenCalled();
  });
});
