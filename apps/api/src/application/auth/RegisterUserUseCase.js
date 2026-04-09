const User = require('../../domain/user/User');

class RegisterUserUseCase {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ email, password, role = 'staff' }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error(`A user with email ${email} already exists`);
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = User.create({ email, passwordHash, role });
    await this.userRepository.save(user);
    return user;
  }
}

module.exports = RegisterUserUseCase;
