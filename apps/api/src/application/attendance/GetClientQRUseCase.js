const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class GetClientQRUseCase {
  constructor({ clientRepository, qrCodeGenerator }) {
    this.clientRepository = clientRepository;
    this.qrCodeGenerator = qrCodeGenerator;
  }

  async execute({ clientId, baseUrl }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();

    const url = `${baseUrl}/check-in/${client.qrToken}`;
    const qrDataUrl = await this.qrCodeGenerator.toDataURL(url);

    return { client, url, qrDataUrl };
  }
}

module.exports = GetClientQRUseCase;
