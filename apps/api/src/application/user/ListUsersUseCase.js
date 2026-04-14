class ListUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ role, isActive } = {}) {
    return this.userRepository.findAll({ role, isActive });
  }
}

module.exports = ListUsersUseCase;
