const knex = require('../db/knex');
const Client = require('../../domain/client/Client');

function toEntity(row) {
  return new Client({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    birthDate: row.birth_date,
    documentNumber: row.document_number,
    isActive: row.is_active,
    qrToken: row.qr_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresClientRepository {
  async findById(id) {
    const row = await knex('clients').where({ id }).first();
    return row ? toEntity(row) : null;
  }

  async findByEmail(email) {
    const row = await knex('clients').where({ email }).first();
    return row ? toEntity(row) : null;
  }

  async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const offset = (page - 1) * limit;
    const query = knex('clients').where({ is_active: true });
    if (search) {
      query.andWhere((q) => {
        q.whereILike('name', `%${search}%`).orWhereILike('document_number', `%${search}%`);
      });
    }

    const [{ count }] = await query.clone().count('id as count');
    const rows = await query.limit(limit).offset(offset).orderBy('created_at', 'desc');

    return { data: rows.map(toEntity), total: Number(count), page, limit };
  }

  async save(client) {
    const [row] = await knex('clients')
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        birth_date: client.birthDate,
        document_number: client.documentNumber,
        is_active: client.isActive,
      })
      .returning('*');
    Object.assign(client, toEntity(row));
    return client;
  }

  async update(client) {
    const [row] = await knex('clients')
      .where({ id: client.id })
      .update({
        name: client.name,
        phone: client.phone,
        birth_date: client.birthDate,
        document_number: client.documentNumber,
        is_active: client.isActive,
        updated_at: knex.fn.now(),
      })
      .returning('*');
    Object.assign(client, toEntity(row));
    return client;
  }

  async softDelete(id) {
    await knex('clients').where({ id }).update({ is_active: false, updated_at: knex.fn.now() });
  }

  async findByQRToken(qrToken) {
    const row = await knex('clients').where({ qr_token: qrToken }).first();
    return row ? toEntity(row) : null;
  }

  async regenerateQRToken(id) {
    const [{ qr_token }] = await knex('clients')
      .where({ id })
      .update({ qr_token: knex.raw('gen_random_uuid()'), updated_at: knex.fn.now() })
      .returning('qr_token');
    return qr_token;
  }
}

module.exports = PostgresClientRepository;
