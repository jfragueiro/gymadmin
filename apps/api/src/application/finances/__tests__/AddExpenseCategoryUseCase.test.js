const AddExpenseCategoryUseCase = require('../AddExpenseCategoryUseCase');

describe('AddExpenseCategoryUseCase', () => {
  let categoryRepository;
  let useCase;

  beforeEach(() => {
    categoryRepository = { save: jest.fn() };
    useCase = new AddExpenseCategoryUseCase({ categoryRepository });
    jest.clearAllMocks();
  });

  it('guarda y retorna la nueva categoría', async () => {
    categoryRepository.save.mockResolvedValue({ id: 3, name: 'Internet' });

    const result = await useCase.execute({ name: 'Internet' });

    expect(categoryRepository.save).toHaveBeenCalledWith({ name: 'Internet' });
    expect(result).toEqual({ id: 3, name: 'Internet' });
  });

  it('lanza error si el nombre está vacío', async () => {
    await expect(useCase.execute({ name: '' })).rejects.toThrow();
    expect(categoryRepository.save).not.toHaveBeenCalled();
  });

  it('lanza error si el nombre no se provee', async () => {
    await expect(useCase.execute({})).rejects.toThrow();
    expect(categoryRepository.save).not.toHaveBeenCalled();
  });
});
