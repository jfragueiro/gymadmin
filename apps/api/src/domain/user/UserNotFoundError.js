class UserNotFoundError extends Error {
  constructor(id) {
    super(`User not found: ${id}`);
    this.name = 'UserNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = UserNotFoundError;
