const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class GetClientMembershipsUseCase {
  constructor({ membershipRepository, clientRepository }) {
    this.membershipRepository = membershipRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError(clientId);

    return this.membershipRepository.findByClientId(clientId);
  }
}

module.exports = GetClientMembershipsUseCase;
