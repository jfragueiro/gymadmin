const UserNotFoundError = require('../../domain/user/UserNotFoundError');

class UpdateUserUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, requesterId, name, email, role }) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    if (role !== undefined && id === requesterId) {
      const err = new Error('No puedes cambiar tu propio rol');
      err.statusCode = 403;
      throw err;
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    return this.userRepository.update(user);
  }
}

module.exports = UpdateUserUseCase;
