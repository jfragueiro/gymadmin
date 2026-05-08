const ValidateQRSessionUseCase = require('../ValidateQRSessionUseCase');
const QRSessionNotFoundError = require('../../../domain/qrSession/QRSessionNotFoundError');
const QRSessionExpiredError = require('../../../domain/qrSession/QRSessionExpiredError');
const QRSessionAlreadyUsedError = require('../../../domain/qrSession/QRSessionAlreadyUsedError');

const activeSession = {
  id: 10,
  clientId: 'uuid-1',
  token: 'tok-abc',
  expiresAt: new Date(Date.now() + 900000), // 15 min in the future
  usedAt: null,
};

const expiredSession = {
  ...activeSession,
  expiresAt: new Date(Date.now() - 1000), // expired
};

const usedSession = {
  ...activeSession,
  usedAt: new Date(),
};

describe('ValidateQRSessionUseCase', () => {
  let qrSessionRepository;
  let attendanceRepository;
  let clientRepository;
  let useCase;

  beforeEach(() => {
    qrSessionRepository = { findByToken: jest.fn(), markAsUsed: jest.fn() };
    attendanceRepository = { save: jest.fn() };
    clientRepository = { findById: jest.fn() };
    useCase = new ValidateQRSessionUseCase({ qrSessionRepository, attendanceRepository, clientRepository });
    jest.clearAllMocks();
  });

  it('registra el check-in y marca la sesión como usada cuando el QR es válido', async () => {
    qrSessionRepository.findByToken.mockResolvedValue(activeSession);
    clientRepository.findById.mockResolvedValue({ id: 'uuid-1', name: 'Juan Pérez' });
    attendanceRepository.save.mockResolvedValue({ id: 99, checkedInAt: new Date() });
    qrSessionRepository.markAsUsed.mockResolvedValue();

    const result = await useCase.execute({ token: 'tok-abc' });

    expect(qrSessionRepository.markAsUsed).toHaveBeenCalledWith(10);
    expect(attendanceRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('clientName', 'Juan Pérez');
    expect(result).toHaveProperty('checkedInAt');
  });

  it('lanza QRSessionNotFoundError si el token no existe', async () => {
    qrSessionRepository.findByToken.mockResolvedValue(null);

    await expect(useCase.execute({ token: 'invalid' }))
      .rejects.toBeInstanceOf(QRSessionNotFoundError);
  });

  it('lanza QRSessionExpiredError si el QR está vencido', async () => {
    qrSessionRepository.findByToken.mockResolvedValue(expiredSession);

    await expect(useCase.execute({ token: 'tok-abc' }))
      .rejects.toBeInstanceOf(QRSessionExpiredError);
  });

  it('lanza QRSessionAlreadyUsedError si el QR ya fue utilizado', async () => {
    qrSessionRepository.findByToken.mockResolvedValue(usedSession);

    await expect(useCase.execute({ token: 'tok-abc' }))
      .rejects.toBeInstanceOf(QRSessionAlreadyUsedError);
  });

  it('no crea attendance si el QR está vencido', async () => {
    qrSessionRepository.findByToken.mockResolvedValue(expiredSession);

    await expect(useCase.execute({ token: 'tok-abc' })).rejects.toThrow();
    expect(attendanceRepository.save).not.toHaveBeenCalled();
  });
});
