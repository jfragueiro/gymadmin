const RequestQRSessionUseCase = require('../RequestQRSessionUseCase');
const ClientNotFoundError = require('../../../domain/client/ClientNotFoundError');
const MembershipExpiredError = require('../../../domain/attendance/MembershipExpiredError');
const AlreadyCheckedInError = require('../../../domain/attendance/AlreadyCheckedInError');

const mockClient = { id: 'uuid-1', name: 'Juan Pérez', isActive: true };
const mockMembership = { id: 1, clientId: 'uuid-1' };
const mockSession = { id: 10, clientId: 'uuid-1', token: 'tok-abc', expiresAt: new Date(Date.now() + 900000) };

describe('RequestQRSessionUseCase', () => {
  let clientRepository;
  let membershipRepository;
  let attendanceRepository;
  let qrSessionRepository;
  let useCase;

  beforeEach(() => {
    clientRepository = { findByDocumentNumber: jest.fn() };
    membershipRepository = { findActiveByClientId: jest.fn() };
    attendanceRepository = { findTodayByClientId: jest.fn() };
    qrSessionRepository = { findActiveByClientId: jest.fn(), save: jest.fn() };
    useCase = new RequestQRSessionUseCase({
      clientRepository, membershipRepository, attendanceRepository, qrSessionRepository,
    });
    jest.clearAllMocks();
  });

  it('crea una nueva sesión QR cuando todo está en orden', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue(mockClient);
    membershipRepository.findActiveByClientId.mockResolvedValue(mockMembership);
    attendanceRepository.findTodayByClientId.mockResolvedValue(null);
    qrSessionRepository.findActiveByClientId.mockResolvedValue(null);
    qrSessionRepository.save.mockResolvedValue(mockSession);

    const result = await useCase.execute({ documentNumber: '12345678' });

    expect(qrSessionRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('expiresAt');
    expect(result).toHaveProperty('clientName', 'Juan Pérez');
    expect(result.isExisting).toBe(false);
  });

  it('retorna la sesión existente si el cliente ya tiene un QR activo', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue(mockClient);
    membershipRepository.findActiveByClientId.mockResolvedValue(mockMembership);
    attendanceRepository.findTodayByClientId.mockResolvedValue(null);
    qrSessionRepository.findActiveByClientId.mockResolvedValue(mockSession);

    const result = await useCase.execute({ documentNumber: '12345678' });

    expect(qrSessionRepository.save).not.toHaveBeenCalled();
    expect(result.token).toBe('tok-abc');
    expect(result.isExisting).toBe(true);
  });

  it('lanza ClientNotFoundError si el DNI no existe', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue(null);

    await expect(useCase.execute({ documentNumber: '99999999' }))
      .rejects.toBeInstanceOf(ClientNotFoundError);
  });

  it('lanza error 403 si el cliente está inactivo', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue({ ...mockClient, isActive: false });

    await expect(useCase.execute({ documentNumber: '12345678' }))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  it('lanza MembershipExpiredError si no tiene membresía activa', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue(mockClient);
    membershipRepository.findActiveByClientId.mockResolvedValue(null);

    await expect(useCase.execute({ documentNumber: '12345678' }))
      .rejects.toBeInstanceOf(MembershipExpiredError);
  });

  it('lanza AlreadyCheckedInError si ya tiene check-in hoy', async () => {
    clientRepository.findByDocumentNumber.mockResolvedValue(mockClient);
    membershipRepository.findActiveByClientId.mockResolvedValue(mockMembership);
    attendanceRepository.findTodayByClientId.mockResolvedValue({ id: 5 });

    await expect(useCase.execute({ documentNumber: '12345678' }))
      .rejects.toBeInstanceOf(AlreadyCheckedInError);
  });
});
