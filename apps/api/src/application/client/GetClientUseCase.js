const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class GetClientUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ id }) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new ClientNotFoundError(id);
    return client;
  }
}

module.exports = GetClientUseCase;
