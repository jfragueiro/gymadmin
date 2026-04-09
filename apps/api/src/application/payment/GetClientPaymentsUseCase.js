const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class GetClientPaymentsUseCase {
  constructor({ paymentRepository, clientRepository }) {
    this.paymentRepository = paymentRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();
    return this.paymentRepository.findByClientId(clientId);
  }
}

module.exports = GetClientPaymentsUseCase;
