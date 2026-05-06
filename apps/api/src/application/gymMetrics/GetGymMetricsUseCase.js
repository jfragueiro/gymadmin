const InvalidDateRangeError = require('../../domain/gymMetrics/InvalidDateRangeError');

class GetGymMetricsUseCase {
  constructor({ attendanceRepository, clientRepository }) {
    this.attendanceRepository = attendanceRepository;
    this.clientRepository = clientRepository;
  }

  async execute({ startDate, endDate }) {
    if (!startDate || !endDate) {
      throw new InvalidDateRangeError();
    }

    const [clientsRegistered, uniqueVisitors, checkInsPerClient] = await Promise.all([
      this.clientRepository.countRegisteredInPeriod(startDate, endDate),
      this.attendanceRepository.countUniqueVisitors(startDate, endDate),
      this.attendanceRepository.getCheckInsPerClient(startDate, endDate),
    ]);

    const totalCheckIns = checkInsPerClient.reduce((sum, c) => sum + c.total, 0);

    return {
      period: { startDate, endDate },
      clientsRegistered,
      uniqueVisitors,
      totalCheckIns,
      checkInsPerClient,
    };
  }
}

module.exports = GetGymMetricsUseCase;
