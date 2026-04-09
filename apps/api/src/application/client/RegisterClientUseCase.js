const Client = require('../../domain/client/Client');

class RegisterClientUseCase {
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  async execute({ name, email, phone, birthDate, documentNumber }) {
    const existing = await this.clientRepository.findByEmail(email);
    if (existing) {
      const err = new Error(`A client with email ${email} already exists`);
      err.statusCode = 409;
      throw err;
    }

    const client = Client.create({ name, email, phone, birthDate, documentNumber });
    await this.clientRepository.save(client);
    return client;
  }
}

module.exports = RegisterClientUseCase;
