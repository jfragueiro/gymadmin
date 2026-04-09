const LoginUseCase = require('../LoginUseCase');
const InvalidCredentialsError = require('../../../domain/user/InvalidCredentialsError');

describe('LoginUseCase', () => {
  let userRepository;
  let passwordHasher;
  let tokenService;
  let useCase;

  beforeEach(() => {
    userRepository = { findByEmail: jest.fn() };
    passwordHasher = { compare: jest.fn() };
    tokenService = { generateToken: jest.fn() };
    useCase = new LoginUseCase({ userRepository, passwordHasher, tokenService });
  });

  it('returns token and user on successful login', async () => {
    const mockUser = { id: 'u1', email: 'admin@example.com', passwordHash: 'hash', role: 'admin' };
    userRepository.findByEmail.mockResolvedValue(mockUser);
    passwordHasher.compare.mockResolvedValue(true);
    tokenService.generateToken.mockReturnValue('signed-token');

    const result = await useCase.execute({ email: 'admin@example.com', password: 'secret' });

    expect(result.token).toBe('signed-token');
    expect(result.user).toEqual(mockUser);
    expect(tokenService.generateToken).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
  });

  it('throws InvalidCredentialsError when user not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute({ email: 'x@x.com', password: 'pass' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError when password is wrong', async () => {
    const mockUser = { id: 'u1', email: 'admin@example.com', passwordHash: 'hash', role: 'admin' };
    userRepository.findByEmail.mockResolvedValue(mockUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute({ email: 'admin@example.com', password: 'wrong' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
