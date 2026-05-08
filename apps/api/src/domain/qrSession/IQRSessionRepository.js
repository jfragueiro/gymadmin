class IQRSessionRepository {
  async save(session) { throw new Error('Not implemented'); }
  async findByToken(token) { throw new Error('Not implemented'); }
  async findActiveByClientId(clientId) { throw new Error('Not implemented'); }
  async markAsUsed(id) { throw new Error('Not implemented'); }
}

module.exports = IQRSessionRepository;
