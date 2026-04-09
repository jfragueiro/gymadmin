class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
    this.statusCode = 401;
  }
}

module.exports = InvalidCredentialsError;
