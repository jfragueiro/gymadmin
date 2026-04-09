class MembershipNotFoundError extends Error {
  constructor(id) {
    super(`Membership not found: ${id}`);
    this.name = 'MembershipNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = MembershipNotFoundError;
