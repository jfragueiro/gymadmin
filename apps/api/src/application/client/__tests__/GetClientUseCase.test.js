const GetClientUseCase = require('../GetClientUseCase');
const ClientNotFoundError = require('../../../domain/client/ClientNotFoundError');

describe('GetClientUseCase', () => {
  let clientRepository;
  let useCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
    };
    useCase = new GetClientUseCase({ clientRepository });
  });

  it('returns client when found', async () => {
    const mockClient = { id: 'abc-123', name: 'John Doe', email: 'john@example.com' };
    clientRepository.findById.mockResolvedValue(mockClient);

    const client = await useCase.execute({ id: 'abc-123' });

    expect(client).toEqual(mockClient);
    expect(clientRepository.findById).toHaveBeenCalledWith('abc-123');
  });

  it('throws ClientNotFoundError when client does not exist', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'nonexistent' })).rejects.toBeInstanceOf(ClientNotFoundError);
  });
});
