class QRSessionExpiredError extends Error {
  constructor() {
    super('El QR ha vencido. Generá uno nuevo.');
    this.name = 'QRSessionExpiredError';
    this.statusCode = 410;
  }
}

module.exports = QRSessionExpiredError;
