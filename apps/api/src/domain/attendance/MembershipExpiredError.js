class MembershipExpiredError extends Error {
  constructor() {
    super('El cliente no tiene una membresía activa vigente');
    this.name = 'MembershipExpiredError';
    this.statusCode = 403;
  }
}

module.exports = MembershipExpiredError;
