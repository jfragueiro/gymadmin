const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

class BcryptPasswordHasher {
  async hash(plain) {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  async compare(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}

module.exports = BcryptPasswordHasher;
