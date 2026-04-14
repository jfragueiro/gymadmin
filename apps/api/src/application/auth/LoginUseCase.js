const InvalidCredentialsError = require('../../domain/user/InvalidCredentialsError');

class LoginUseCase {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) throw new InvalidCredentialsError();

    const valid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    await this.userRepository.updateLastLogin(user.id);

    const token = this.tokenService.generateToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}

module.exports = LoginUseCase;
