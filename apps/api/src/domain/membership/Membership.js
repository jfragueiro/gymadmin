class Membership {
  constructor({ id, clientId, planId, startDate, endDate, status = 'active', createdAt, updatedAt }) {
    if (!clientId) throw new Error('Membership clientId is required');
    if (!planId) throw new Error('Membership planId is required');
    if (!startDate) throw new Error('Membership startDate is required');

    this.id = id;
    this.clientId = clientId;
    this.planId = planId;
    this.startDate = startDate;
    this.endDate = endDate || null;
    this.status = status;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }

  static create({ id, clientId, planId, startDate, endDate, status }) {
    return new Membership({ id, clientId, planId, startDate, endDate, status });
  }
}

module.exports = Membership;
