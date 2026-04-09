const QRCode = require('qrcode');

class QRCodeGenerator {
  async toDataURL(text) {
    return QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
  }
}

module.exports = QRCodeGenerator;
