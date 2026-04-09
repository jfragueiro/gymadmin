const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class SoftDeleteClientUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ id }) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new ClientNotFoundError(id);

    client.isActive = false;
    await this.clientRepository.update(client);
    return client;
  }
}

module.exports = SoftDeleteClientUseCase;
