class QRSessionAlreadyUsedError extends Error {
  constructor() {
    super('Este QR ya fue utilizado.');
    this.name = 'QRSessionAlreadyUsedError';
    this.statusCode = 409;
  }
}

module.exports = QRSessionAlreadyUsedError;
