const UserNotFoundError = require('../../domain/user/UserNotFoundError');

class UpdateOwnProfileUseCase {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ id, name, currentPassword, newPassword }) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    if (name !== undefined) user.name = name;

    if (newPassword) {
      const valid = await this.passwordHasher.compare(currentPassword, user.passwordHash);
      if (!valid) {
        const err = new Error('Contraseña actual incorrecta');
        err.statusCode = 400;
        throw err;
      }
      user.passwordHash = await this.passwordHasher.hash(newPassword);
    }

    return this.userRepository.update(user);
  }
}

module.exports = UpdateOwnProfileUseCase;
