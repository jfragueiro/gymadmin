const knex = require('../db/knex');
const Payment = require('../../domain/payment/Payment');

function toEntity(row) {
  return new Payment({
    id: row.id,
    membershipId: row.membership_id,
    clientId: row.client_id,
    amount: parseFloat(row.amount),
    paymentDate: row.payment_date,
    method: row.method,
    reference: row.reference,
    notes: row.notes,
    createdAt: row.created_at,
  });
}

class PostgresPaymentRepository {
  async save(payment) {
    const [row] = await knex('payments')
      .insert({
        membership_id: payment.membershipId,
        client_id: payment.clientId,
        amount: payment.amount,
        payment_date: payment.paymentDate,
        method: payment.method,
        reference: payment.reference,
        notes: payment.notes,
      })
      .returning('*');
    return toEntity(row);
  }

  async findByClientId(clientId) {
    const rows = await knex('payments')
      .where({ client_id: clientId })
      .orderBy('payment_date', 'desc');
    return rows.map(toEntity);
  }
}

module.exports = PostgresPaymentRepository;
