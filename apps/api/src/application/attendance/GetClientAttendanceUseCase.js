const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class GetClientAttendanceUseCase {
  constructor({ attendanceRepository, clientRepository }) {
    this.attendanceRepository = attendanceRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();
    return this.attendanceRepository.findByClientId(clientId);
  }
}

module.exports = GetClientAttendanceUseCase;
