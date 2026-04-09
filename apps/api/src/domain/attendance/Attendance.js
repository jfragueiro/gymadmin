class Attendance {
  constructor({ id, clientId, checkedInBy, checkedInAt, notes, method }) {
    this.id = id;
    this.clientId = clientId;
    this.checkedInBy = checkedInBy;
    this.checkedInAt = checkedInAt || new Date();
    this.notes = notes || null;
    this.method = method || 'manual';
  }
}

module.exports = Attendance;
