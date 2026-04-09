const Attendance = require('../../domain/attendance/Attendance');
const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');

class CheckInUseCase {
  constructor({ attendanceRepository, clientRepository }) {
    this.attendanceRepository = attendanceRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ clientId, checkedInBy, notes }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();

    const attendance = new Attendance({ clientId, checkedInBy, notes });
    return this.attendanceRepository.save(attendance);
  }
}

module.exports = CheckInUseCase;
