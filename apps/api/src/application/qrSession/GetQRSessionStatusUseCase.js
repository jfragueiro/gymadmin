const QRSessionNotFoundError = require('../../domain/qrSession/QRSessionNotFoundError');

class GetQRSessionStatusUseCase {
  constructor({ qrSessionRepository }) {
    this.qrSessionRepository = qrSessionRepository;
  }

  async execute({ token }) {
    const session = await this.qrSessionRepository.findByToken(token);
    if (!session) throw new QRSessionNotFoundError();

    if (session.usedAt) return { status: 'used' };
    if (new Date() > new Date(session.expiresAt)) return { status: 'expired' };

    return { status: 'pending', expiresAt: session.expiresAt };
  }
}

module.exports = GetQRSessionStatusUseCase;
