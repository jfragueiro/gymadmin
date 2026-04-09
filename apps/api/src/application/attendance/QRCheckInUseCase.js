const Attendance = require('../../domain/attendance/Attendance');
const InvalidQRTokenError = require('../../domain/attendance/InvalidQRTokenError');
const AlreadyCheckedInError = require('../../domain/attendance/AlreadyCheckedInError');
const MembershipExpiredError = require('../../domain/attendance/MembershipExpiredError');

const CHECKIN_COOLDOWN_HOURS = 2;

class QRCheckInUseCase {
  constructor({ clientRepository, membershipRepository, attendanceRepository }) {
    this.clientRepository = clientRepository;
    this.membershipRepository = membershipRepository;
    this.attendanceRepository = attendanceRepository;
  }

  async execute({ qrToken }) {
    const client = await this.clientRepository.findByQRToken(qrToken);
    if (!client) throw new InvalidQRTokenError();

    if (!client.isActive) {
      const err = new Error('El cliente está inactivo o suspendido');
      err.statusCode = 403;
      throw err;
    }

    const activeMembership = await this.membershipRepository.findActiveByClientId(client.id);
    if (!activeMembership) throw new MembershipExpiredError();

    const recentCheckIn = await this.attendanceRepository.findRecentByClientId(
      client.id,
      CHECKIN_COOLDOWN_HOURS
    );
    if (recentCheckIn) throw new AlreadyCheckedInError();

    const attendance = new Attendance({
      clientId: client.id,
      checkedInBy: client.id,
      method: 'qr',
    });
    const record = await this.attendanceRepository.save(attendance);

    return { client, record };
  }
}

module.exports = QRCheckInUseCase;
