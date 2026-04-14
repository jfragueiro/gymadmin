const User = require('../../domain/user/User');

class CreateUserUseCase {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password, role }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Ya existe un usuario con ese email');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = User.create({ name, email, passwordHash, role });
    return this.userRepository.save(user);
  }
}

module.exports = CreateUserUseCase;
