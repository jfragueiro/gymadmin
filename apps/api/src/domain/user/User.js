class User {
  constructor({ id, email, passwordHash, role = 'staff', isActive = true, createdAt, updatedAt }) {
    if (!email) throw new Error('User email is required');
    if (!passwordHash) throw new Error('User passwordHash is required');

    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }

  static create({ id, email, passwordHash, role }) {
    return new User({ id, email, passwordHash, role });
  }
}

module.exports = User;
