class AlreadyCheckedInError extends Error {
  constructor() {
    super('El cliente ya realizó check-in en las últimas 2 horas');
    this.name = 'AlreadyCheckedInError';
    this.statusCode = 409;
  }
}

module.exports = AlreadyCheckedInError;
