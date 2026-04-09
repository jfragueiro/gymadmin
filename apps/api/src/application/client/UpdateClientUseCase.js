const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class UpdateClientUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ id, name, phone, birthDate, documentNumber }) {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new ClientNotFoundError(id);

    if (name !== undefined) client.name = name;
    if (phone !== undefined) client.phone = phone;
    if (birthDate !== undefined) client.birthDate = birthDate;
    if (documentNumber !== undefined) client.documentNumber = documentNumber;

    await this.clientRepository.update(client);
    return client;
  }
}

module.exports = UpdateClientUseCase;
