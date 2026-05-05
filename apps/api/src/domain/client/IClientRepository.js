class IClientRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findAll({ page, limit }) { throw new Error('Not implemented'); }
  async save(client) { throw new Error('Not implemented'); }
  async update(client) { throw new Error('Not implemented'); }
  async softDelete(id) { throw new Error('Not implemented'); }
  async countRegisteredInPeriod(startDate, endDate) { throw new Error('Not implemented'); }
}

module.exports = IClientRepository;
