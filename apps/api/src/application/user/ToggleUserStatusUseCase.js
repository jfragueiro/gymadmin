const UserNotFoundError = require('../../domain/user/UserNotFoundError');

class ToggleUserStatusUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, requesterId, isActive }) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    if (id === requesterId) {
      const err = new Error('No puedes deshabilitarte a ti mismo');
      err.statusCode = 403;
      throw err;
    }

    // Protect the last active admin
    if (!isActive && user.role === 'admin') {
      const activeAdmins = await this.userRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        const err = new Error('No se puede deshabilitar al único Administrador activo');
        err.statusCode = 403;
        throw err;
      }
    }

    isActive ? user.enable() : user.disable();
    return this.userRepository.update(user);
  }
}

module.exports = ToggleUserStatusUseCase;
