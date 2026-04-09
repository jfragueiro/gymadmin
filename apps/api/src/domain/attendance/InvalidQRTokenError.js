class InvalidQRTokenError extends Error {
  constructor() {
    super('QR token inválido o inexistente');
    this.name = 'InvalidQRTokenError';
    this.statusCode = 404;
  }
}

module.exports = InvalidQRTokenError;
