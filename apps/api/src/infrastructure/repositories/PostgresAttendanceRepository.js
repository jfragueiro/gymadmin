const knex = require('../db/knex');
const Attendance = require('../../domain/attendance/Attendance');

function toEntity(row) {
  return new Attendance({
    id: row.id,
    clientId: row.client_id,
    checkedInBy: row.checked_in_by,
    checkedInAt: row.checked_in_at,
    notes: row.notes,
    method: row.method,
  });
}

class PostgresAttendanceRepository {
  async save(attendance) {
    const [row] = await knex('attendance')
      .insert({
        client_id: attendance.clientId,
        checked_in_by: attendance.checkedInBy,
        checked_in_at: attendance.checkedInAt,
        notes: attendance.notes,
        method: attendance.method,
      })
      .returning('*');
    return toEntity(row);
  }

  async findByClientId(clientId) {
    const rows = await knex('attendance')
      .where({ client_id: clientId })
      .orderBy('checked_in_at', 'desc');
    return rows.map(toEntity);
  }

  async findByDate(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const rows = await knex('attendance')
      .join('clients', 'attendance.client_id', 'clients.id')
      .whereBetween('checked_in_at', [start, end])
      .orderBy('checked_in_at', 'desc')
      .select(
        'attendance.*',
        'clients.name as client_name',
        'clients.email as client_email'
      );

    return rows.map((row) => ({
      ...toEntity(row),
      clientName: row.client_name,
      clientEmail: row.client_email,
    }));
  }

  async findRecentByClientId(clientId, hours = 2) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const row = await knex('attendance')
      .where({ client_id: clientId })
      .where('checked_in_at', '>=', since)
      .orderBy('checked_in_at', 'desc')
      .first();
    return row ? toEntity(row) : null;
  }

  async findTodayByClientId(clientId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const row = await knex('attendance')
      .where({ client_id: clientId })
      .whereBetween('checked_in_at', [start, end])
      .first();
    return row ? toEntity(row) : null;
  }

  async countUniqueVisitors(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [{ count }] = await knex('attendance')
      .whereBetween('checked_in_at', [start, end])
      .countDistinct('client_id as count');
    return Number(count);
  }

  async getCheckInsPerClient(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const rows = await knex('attendance')
      .join('clients', 'attendance.client_id', 'clients.id')
      .whereBetween('attendance.checked_in_at', [start, end])
      .groupBy('attendance.client_id', 'clients.name')
      .select(
        'attendance.client_id',
        'clients.name as client_name',
        knex.raw('COUNT(*) as total')
      )
      .orderBy('total', 'desc');

    return rows.map((r) => ({
      clientId: r.client_id,
      clientName: r.client_name,
      total: Number(r.total),
    }));
  }
}

module.exports = PostgresAttendanceRepository;
