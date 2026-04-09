const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class RegenerateQRTokenUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ clientId }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();

    const newToken = await this.clientRepository.regenerateQRToken(clientId);
    return { qrToken: newToken };
  }
}

module.exports = RegenerateQRTokenUseCase;
