const { ROLES_LIST } = require('@gymadmin/shared');
const InvalidRoleError = require('./InvalidRoleError');

class User {
  constructor({ id, name, email, passwordHash, role, isActive, lastLoginAt, createdAt, updatedAt }) {
    if (!ROLES_LIST.includes(role)) throw new InvalidRoleError(role);
    if (!email) throw new Error('User email is required');
    if (!passwordHash) throw new Error('User passwordHash is required');

    this.id = id;
    this.name = name || null;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isActive = isActive ?? true;
    this.lastLoginAt = lastLoginAt || null;
    this.createdAt = createdAt || null;
    this.updatedAt = updatedAt || null;
  }

  static create({ name, email, passwordHash, role }) {
    return new User({ name, email, passwordHash, role });
  }

  disable() { this.isActive = false; }
  enable()  { this.isActive = true; }
}

module.exports = User;
