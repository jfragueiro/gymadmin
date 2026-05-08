const { randomUUID } = require('crypto');
const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');
const MembershipExpiredError = require('../../domain/attendance/MembershipExpiredError');
const AlreadyCheckedInError = require('../../domain/attendance/AlreadyCheckedInError');

const QR_SESSION_MINUTES = 15;

class RequestQRSessionUseCase {
  constructor({ clientRepository, membershipRepository, attendanceRepository, qrSessionRepository }) {
    this.clientRepository = clientRepository;
    this.membershipRepository = membershipRepository;
    this.attendanceRepository = attendanceRepository;
    this.qrSessionRepository = qrSessionRepository;
  }

  async execute({ documentNumber }) {
    const client = await this.clientRepository.findByDocumentNumber(documentNumber);
    if (!client) throw new ClientNotFoundError();

    if (!client.isActive) {
      const err = new Error('El cliente está inactivo o suspendido');
      err.statusCode = 403;
      throw err;
    }

    const membership = await this.membershipRepository.findActiveByClientId(client.id);
    if (!membership) throw new MembershipExpiredError();

    const checkedInToday = await this.attendanceRepository.findTodayByClientId(client.id);
    if (checkedInToday) throw new AlreadyCheckedInError();

    // Si ya tiene una sesión QR activa, devolver la misma
    const existingSession = await this.qrSessionRepository.findActiveByClientId(client.id);
    if (existingSession) {
      return {
        token: existingSession.token,
        expiresAt: existingSession.expiresAt,
        clientName: client.name,
        isExisting: true,
      };
    }

    const expiresAt = new Date(Date.now() + QR_SESSION_MINUTES * 60 * 1000);
    const session = await this.qrSessionRepository.save({
      clientId: client.id,
      token: randomUUID(),
      expiresAt,
    });

    return {
      token: session.token,
      expiresAt: session.expiresAt,
      clientName: client.name,
      isExisting: false,
    };
  }
}

module.exports = RequestQRSessionUseCase;
