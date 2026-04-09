class IMembershipRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByClientId(clientId) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async save(membership) { throw new Error('Not implemented'); }
  async update(membership) { throw new Error('Not implemented'); }
}

module.exports = IMembershipRepository;
