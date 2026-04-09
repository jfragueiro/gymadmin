class Payment {
  constructor({ id, membershipId, clientId, amount, paymentDate, method, reference, notes, createdAt }) {
    this.id = id;
    this.membershipId = membershipId;
    this.clientId = clientId;
    this.amount = amount;
    this.paymentDate = paymentDate || new Date();
    this.method = method || 'cash';
    this.reference = reference || null;
    this.notes = notes || null;
    this.createdAt = createdAt || null;
  }
}

module.exports = Payment;
