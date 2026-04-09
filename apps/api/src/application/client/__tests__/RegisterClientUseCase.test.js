const RegisterClientUseCase = require('../RegisterClientUseCase');

describe('RegisterClientUseCase', () => {
  let clientRepository;
  let useCase;

  beforeEach(() => {
    clientRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    useCase = new RegisterClientUseCase({ clientRepository });
  });

  it('registers a new client successfully', async () => {
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.save.mockResolvedValue();

    const client = await useCase.execute({ name: 'Jane Doe', email: 'jane@example.com' });

    expect(clientRepository.findByEmail).toHaveBeenCalledWith('jane@example.com');
    expect(clientRepository.save).toHaveBeenCalled();
    expect(client.name).toBe('Jane Doe');
    expect(client.email).toBe('jane@example.com');
  });

  it('throws when email already exists', async () => {
    clientRepository.findByEmail.mockResolvedValue({ id: '1', email: 'jane@example.com' });

    await expect(
      useCase.execute({ name: 'Jane Doe', email: 'jane@example.com' })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(clientRepository.save).not.toHaveBeenCalled();
  });
});
