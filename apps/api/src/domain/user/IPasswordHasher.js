class IPasswordHasher {
  async hash(plain) { throw new Error('Not implemented'); }
  async compare(plain, hash) { throw new Error('Not implemented'); }
}

module.exports = IPasswordHasher;
