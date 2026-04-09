class IUserRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async save(user) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;
