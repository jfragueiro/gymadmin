const knex = require('../db/knex');
const User = require('../../domain/user/User');

function toEntity(row) {
  return new User({
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresUserRepository {
  async findById(id) {
    const row = await knex('users').where({ id }).first();
    return row ? toEntity(row) : null;
  }

  async findByEmail(email) {
    const row = await knex('users').where({ email }).first();
    return row ? toEntity(row) : null;
  }

  async findAll({ role, isActive } = {}) {
    const query = knex('users').orderBy('name', 'asc');
    if (role) query.where({ role });
    if (isActive !== undefined) query.where({ is_active: isActive });
    const rows = await query;
    return rows.map(toEntity);
  }

  async countActiveAdmins() {
    const [{ count }] = await knex('users')
      .where({ role: 'admin', is_active: true })
      .count('id as count');
    return parseInt(count);
  }

  async save(user) {
    const [row] = await knex('users')
      .insert({
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
        is_active: user.isActive,
      })
      .returning('*');
    Object.assign(user, toEntity(row));
    return user;
  }

  async update(user) {
    const [row] = await knex('users')
      .where({ id: user.id })
      .update({
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
        is_active: user.isActive,
        updated_at: knex.fn.now(),
      })
      .returning('*');
    return toEntity(row);
  }

  async updateLastLogin(id) {
    await knex('users').where({ id }).update({ last_login_at: knex.fn.now() });
  }
}

module.exports = PostgresUserRepository;
