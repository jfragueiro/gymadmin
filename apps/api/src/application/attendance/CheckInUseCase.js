const Attendance = require('../../domain/attendance/Attendance');
const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');
const MembershipExpiredError = require('../../domain/attendance/MembershipExpiredError');
const AlreadyCheckedInError = require('../../domain/attendance/AlreadyCheckedInError');

const CHECKIN_COOLDOWN_HOURS = 2;

class CheckInUseCase {
  constructor({ attendanceRepository, clientRepository, membershipRepository }) {
    this.attendanceRepository = attendanceRepository;
    this.clientRepository = clientRepository;
    this.membershipRepository = membershipRepository;
  }

  async execute({ clientId, checkedInBy, notes }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError();

    if (!client.isActive) {
      const err = new Error('El cliente está inactivo o suspendido');
      err.statusCode = 403;
      throw err;
    }

    const activeMembership = await this.membershipRepository.findActiveByClientId(clientId);
    if (!activeMembership) throw new MembershipExpiredError();

    const recentCheckIn = await this.attendanceRepository.findRecentByClientId(
      clientId,
      CHECKIN_COOLDOWN_HOURS
    );
    if (recentCheckIn) throw new AlreadyCheckedInError();

    const attendance = new Attendance({ clientId, checkedInBy, notes });
    return this.attendanceRepository.save(attendance);
  }
}

module.exports = CheckInUseCase;
