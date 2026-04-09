const InvalidCredentialsError = require('../../domain/user/InvalidCredentialsError');

class LoginUseCase {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.tokenService.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user };
  }
}

module.exports = LoginUseCase;
