const knex = require('../db/knex');
const User = require('../../domain/user/User');

function toEntity(row) {
  return new User({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active,
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

  async save(user) {
    const [row] = await knex('users')
      .insert({
        email: user.email,
        password_hash: user.passwordHash,
        role: user.role,
        is_active: user.isActive,
      })
      .returning('*');
    Object.assign(user, toEntity(row));
    return user;
  }
}

module.exports = PostgresUserRepository;
