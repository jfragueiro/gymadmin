const GetGymMetricsUseCase = require('../GetGymMetricsUseCase');
const InvalidDateRangeError = require('../../../domain/gymMetrics/InvalidDateRangeError');

describe('GetGymMetricsUseCase', () => {
  let attendanceRepository;
  let clientRepository;
  let useCase;

  beforeEach(() => {
    attendanceRepository = {
      countUniqueVisitors: jest.fn(),
      getCheckInsPerClient: jest.fn(),
    };
    clientRepository = {
      countRegisteredInPeriod: jest.fn(),
    };
    useCase = new GetGymMetricsUseCase({ attendanceRepository, clientRepository });
    jest.clearAllMocks();
  });

  it('retorna las métricas del período cuando los parámetros son válidos', async () => {
    clientRepository.countRegisteredInPeriod.mockResolvedValue(5);
    attendanceRepository.countUniqueVisitors.mockResolvedValue(20);
    attendanceRepository.getCheckInsPerClient.mockResolvedValue([
      { clientId: '1', clientName: 'Juan López', total: 8 },
      { clientId: '2', clientName: 'Ana Gómez', total: 3 },
    ]);

    const result = await useCase.execute({ startDate: '2026-05-01', endDate: '2026-05-31' });

    expect(result).toEqual({
      period: { startDate: '2026-05-01', endDate: '2026-05-31' },
      clientsRegistered: 5,
      uniqueVisitors: 20,
      totalCheckIns: 11,
      checkInsPerClient: [
        { clientId: '1', clientName: 'Juan López', total: 8 },
        { clientId: '2', clientName: 'Ana Gómez', total: 3 },
      ],
    });
  });

  it('llama a los dos repositorios con las fechas correctas', async () => {
    clientRepository.countRegisteredInPeriod.mockResolvedValue(0);
    attendanceRepository.countUniqueVisitors.mockResolvedValue(0);
    attendanceRepository.getCheckInsPerClient.mockResolvedValue([]);

    await useCase.execute({ startDate: '2026-01-01', endDate: '2026-01-31' });

    expect(clientRepository.countRegisteredInPeriod).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
    expect(attendanceRepository.countUniqueVisitors).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
    expect(attendanceRepository.getCheckInsPerClient).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
  });

  it('calcula totalCheckIns como la suma de los ingresos por cliente', async () => {
    clientRepository.countRegisteredInPeriod.mockResolvedValue(0);
    attendanceRepository.countUniqueVisitors.mockResolvedValue(0);
    attendanceRepository.getCheckInsPerClient.mockResolvedValue([
      { clientId: '1', clientName: 'A', total: 10 },
      { clientId: '2', clientName: 'B', total: 7 },
      { clientId: '3', clientName: 'C', total: 3 },
    ]);

    const result = await useCase.execute({ startDate: '2026-05-01', endDate: '2026-05-31' });

    expect(result.totalCheckIns).toBe(20);
  });

  it('retorna totalCheckIns en 0 cuando no hay ingresos en el período', async () => {
    clientRepository.countRegisteredInPeriod.mockResolvedValue(0);
    attendanceRepository.countUniqueVisitors.mockResolvedValue(0);
    attendanceRepository.getCheckInsPerClient.mockResolvedValue([]);

    const result = await useCase.execute({ startDate: '2026-05-01', endDate: '2026-05-31' });

    expect(result.totalCheckIns).toBe(0);
    expect(result.checkInsPerClient).toHaveLength(0);
  });

  it('lanza InvalidDateRangeError cuando startDate está ausente', async () => {
    await expect(
      useCase.execute({ startDate: '', endDate: '2026-05-31' })
    ).rejects.toBeInstanceOf(InvalidDateRangeError);
  });

  it('lanza InvalidDateRangeError cuando endDate está ausente', async () => {
    await expect(
      useCase.execute({ startDate: '2026-05-01', endDate: '' })
    ).rejects.toBeInstanceOf(InvalidDateRangeError);
  });

  it('lanza InvalidDateRangeError cuando ambos parámetros están ausentes', async () => {
    await expect(
      useCase.execute({ startDate: undefined, endDate: undefined })
    ).rejects.toBeInstanceOf(InvalidDateRangeError);
  });
});
