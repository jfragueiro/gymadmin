class GetDailyAttendanceUseCase {
  constructor({ attendanceRepository }) {
    this.attendanceRepository = attendanceRepository;
  }

  async execute({ date } = {}) {
    const target = date ? new Date(date) : new Date();
    return this.attendanceRepository.findByDate(target);
  }
}

module.exports = GetDailyAttendanceUseCase;
