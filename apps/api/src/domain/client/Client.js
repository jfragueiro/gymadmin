class Client {
  constructor({ id, name, email, phone, birthDate, documentNumber, isActive = true, qrToken, telegramChatId, telegramLinkedAt, createdAt, updatedAt }) {
    if (!name) throw new Error('Client name is required');
    if (!email) throw new Error('Client email is required');

    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone || null;
    this.birthDate = birthDate || null;
    this.documentNumber = documentNumber || null;
    this.isActive = isActive;
    this.qrToken = qrToken || null;
    this.telegramChatId = telegramChatId || null;
    this.telegramLinkedAt = telegramLinkedAt || null;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }

  static create({ id, name, email, phone, birthDate, documentNumber }) {
    return new Client({ id, name, email, phone, birthDate, documentNumber });
  }
}

module.exports = Client;
