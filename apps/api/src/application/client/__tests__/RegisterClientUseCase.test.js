const RegisterClientUseCase = require('../RegisterClientUseCase');
const ClientAlreadyExistsError = require('../../../domain/client/ClientAlreadyExistsError');

describe('RegisterClientUseCase', () => {
  let clientRepository;
  let useCase;

  beforeEach(() => {
    clientRepository = {
      findByEmail: jest.fn(),
      findByDocumentNumber: jest.fn(),
      save: jest.fn(),
    };
    useCase = new RegisterClientUseCase({ clientRepository });
    jest.clearAllMocks();
  });

  it('registra un cliente nuevo cuando email y documento no existen', async () => {
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByDocumentNumber.mockResolvedValue(null);
    clientRepository.save.mockResolvedValue();

    const client = await useCase.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      documentNumber: '12345678',
    });

    expect(clientRepository.findByEmail).toHaveBeenCalledWith('jane@example.com');
    expect(clientRepository.findByDocumentNumber).toHaveBeenCalledWith('12345678');
    expect(clientRepository.save).toHaveBeenCalled();
    expect(client.name).toBe('Jane Doe');
    expect(client.email).toBe('jane@example.com');
  });

  it('lanza ClientAlreadyExistsError cuando el email ya está registrado', async () => {
    clientRepository.findByEmail.mockResolvedValue({ id: '1', email: 'jane@example.com' });
    clientRepository.findByDocumentNumber.mockResolvedValue(null);

    await expect(
      useCase.execute({ name: 'Jane Doe', email: 'jane@example.com', documentNumber: '12345678' })
    ).rejects.toBeInstanceOf(ClientAlreadyExistsError);

    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('lanza ClientAlreadyExistsError cuando el DNI ya está registrado', async () => {
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByDocumentNumber.mockResolvedValue({ id: '2', documentNumber: '12345678' });

    await expect(
      useCase.execute({ name: 'Jane Doe', email: 'jane@example.com', documentNumber: '12345678' })
    ).rejects.toBeInstanceOf(ClientAlreadyExistsError);

    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('el error de DNI duplicado tiene statusCode 409', async () => {
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByDocumentNumber.mockResolvedValue({ id: '2' });

    await expect(
      useCase.execute({ name: 'Jane Doe', email: 'jane@example.com', documentNumber: '12345678' })
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});
