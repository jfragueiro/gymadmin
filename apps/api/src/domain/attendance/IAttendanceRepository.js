/**
 * @interface IAttendanceRepository
 */
class IAttendanceRepository {
  async save(attendance) { throw new Error('Not implemented'); }
  async findByClientId(clientId) { throw new Error('Not implemented'); }
  async findByDate(date) { throw new Error('Not implemented'); }
  async findTodayByClientId(clientId) { throw new Error('Not implemented'); }
  async countUniqueVisitors(startDate, endDate) { throw new Error('Not implemented'); }
  async getCheckInsPerClient(startDate, endDate) { throw new Error('Not implemented'); }
}

module.exports = IAttendanceRepository;
