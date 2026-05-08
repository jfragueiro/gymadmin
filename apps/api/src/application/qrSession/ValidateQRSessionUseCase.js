const Attendance = require('../../domain/attendance/Attendance');
const QRSessionNotFoundError = require('../../domain/qrSession/QRSessionNotFoundError');
const QRSessionExpiredError = require('../../domain/qrSession/QRSessionExpiredError');
const QRSessionAlreadyUsedError = require('../../domain/qrSession/QRSessionAlreadyUsedError');

class ValidateQRSessionUseCase {
  constructor({ qrSessionRepository, attendanceRepository, clientRepository }) {
    this.qrSessionRepository = qrSessionRepository;
    this.attendanceRepository = attendanceRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ token }) {
    const session = await this.qrSessionRepository.findByToken(token);
    if (!session) throw new QRSessionNotFoundError();

    if (session.usedAt) throw new QRSessionAlreadyUsedError();

    if (new Date() > new Date(session.expiresAt)) throw new QRSessionExpiredError();

    const client = await this.clientRepository.findById(session.clientId);

    const attendance = new Attendance({
      clientId: session.clientId,
      checkedInBy: session.clientId,
      method: 'qr',
    });
    const record = await this.attendanceRepository.save(attendance);

    await this.qrSessionRepository.markAsUsed(session.id);

    return {
      clientName: client?.name ?? 'Cliente',
      checkedInAt: record.checkedInAt,
    };
  }
}

module.exports = ValidateQRSessionUseCase;
