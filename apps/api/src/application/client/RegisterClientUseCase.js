const Client = require('../../domain/client/Client');
const ClientAlreadyExistsError = require('../../domain/client/ClientAlreadyExistsError');

class RegisterClientUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ name, email, phone, birthDate, documentNumber }) {
    const [existingEmail, existingDni] = await Promise.all([
      this.clientRepository.findByEmail(email),
      this.clientRepository.findByDocumentNumber(documentNumber),
    ]);

    if (existingEmail) throw new ClientAlreadyExistsError('email');
    if (existingDni) throw new ClientAlreadyExistsError('documento');

    const client = Client.create({ name, email, phone, birthDate, documentNumber });
    await this.clientRepository.save(client);
    return client;
  }
}

module.exports = RegisterClientUseCase;
