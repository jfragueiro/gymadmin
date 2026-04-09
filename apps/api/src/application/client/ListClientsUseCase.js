class ListClientsUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ page = 1, limit = 20, search = '' } = {}) {
    return this.clientRepository.findAll({ page, limit, search });
  }
}

module.exports = ListClientsUseCase;
