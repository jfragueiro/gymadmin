const {
  checkInUseCase,
  getDailyAttendanceUseCase,
  getClientAttendanceUseCase,
} = require('../../infrastructure/container');

class AttendanceController {
  async checkIn(req, res, next) {
    try {
      const { clientId, notes } = req.body;
      const checkedInBy = req.user.sub;
      const record = await checkInUseCase.execute({ clientId, checkedInBy, notes });
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }

  async getDaily(req, res, next) {
    try {
      const { date } = req.query;
      const records = await getDailyAttendanceUseCase.execute({ date });
      res.json(records);
    } catch (err) {
      next(err);
    }
  }

  async getByClient(req, res, next) {
    try {
      const records = await getClientAttendanceUseCase.execute({
        clientId: req.params.clientId,
      });
      res.json(records);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AttendanceController();
