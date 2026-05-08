const knex = require('../db/knex');

class PostgresQRSessionRepository {
  async save({ clientId, token, expiresAt }) {
    const [row] = await knex('qr_sessions')
      .insert({ client_id: clientId, token, expires_at: expiresAt })
      .returning('*');
    return this._toEntity(row);
  }

  async findByToken(token) {
    const row = await knex('qr_sessions').where({ token }).first();
    return row ? this._toEntity(row) : null;
  }

  async findActiveByClientId(clientId) {
    const row = await knex('qr_sessions')
      .where({ client_id: clientId })
      .whereNull('used_at')
      .where('expires_at', '>', new Date())
      .orderBy('created_at', 'desc')
      .first();
    return row ? this._toEntity(row) : null;
  }

  async markAsUsed(id) {
    await knex('qr_sessions').where({ id }).update({ used_at: new Date() });
  }

  _toEntity(row) {
    return {
      id: row.id,
      clientId: row.client_id,
      token: row.token,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at,
    };
  }
}

module.exports = PostgresQRSessionRepository;
