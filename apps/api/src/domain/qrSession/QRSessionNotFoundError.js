class QRSessionNotFoundError extends Error {
  constructor() {
    super('QR inválido o no encontrado.');
    this.name = 'QRSessionNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = QRSessionNotFoundError;
