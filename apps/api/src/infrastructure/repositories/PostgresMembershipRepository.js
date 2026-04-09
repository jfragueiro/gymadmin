const knex = require('../db/knex');
const Membership = require('../../domain/membership/Membership');

function toEntity(row) {
  return new Membership({
    id: row.id,
    clientId: row.client_id,
    planId: row.plan_id,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresMembershipRepository {
  async findById(id) {
    const row = await knex('memberships').where({ id }).first();
    return row ? toEntity(row) : null;
  }

  async findByClientId(clientId) {
    const rows = await knex('memberships')
      .leftJoin('plans', 'memberships.plan_id', 'plans.id')
      .where({ 'memberships.client_id': clientId })
      .orderBy('memberships.created_at', 'desc')
      .select(
        'memberships.*',
        'plans.name as plan_name',
        'plans.price as plan_price',
        'plans.duration_days as plan_duration_days'
      );
    return rows.map((row) => ({
      ...toEntity(row),
      planName: row.plan_name,
      planPrice: row.plan_price ? parseFloat(row.plan_price) : null,
      planDurationDays: row.plan_duration_days,
    }));
  }

  async findActiveByClientId(clientId) {
    const row = await knex('memberships')
      .where({ client_id: clientId, status: 'active' })
      .where('end_date', '>=', knex.fn.now())
      .orderBy('end_date', 'desc')
      .first();
    return row ? toEntity(row) : null;
  }

  async findAllClientsWithActiveMembership() {
    const rows = await knex('clients')
      .leftJoin('memberships', function () {
        this.on('memberships.client_id', '=', 'clients.id')
          .andOn('memberships.status', '=', knex.raw("'active'"))
          .andOn('memberships.end_date', '>=', knex.raw('CURRENT_DATE'));
      })
      .leftJoin('plans', 'memberships.plan_id', 'plans.id')
      .where('clients.is_active', true)
      .orderBy('clients.name', 'asc')
      .select(
        'clients.id as client_id',
        'clients.name as client_name',
        'clients.email as client_email',
        'clients.document_number as client_document_number',
        'memberships.id as membership_id',
        'memberships.start_date',
        'memberships.end_date',
        'memberships.status',
        'plans.name as plan_name',
        'plans.price as plan_price'
      );

    return rows.map((row) => ({
      clientId: row.client_id,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientDocumentNumber: row.client_document_number || null,
      membershipId: row.membership_id || null,
      startDate: row.start_date || null,
      endDate: row.end_date || null,
      status: row.status || null,
      planName: row.plan_name || null,
      planPrice: row.plan_price ? parseFloat(row.plan_price) : null,
    }));
  }

  async findAll() {
    const rows = await knex('memberships').orderBy('created_at', 'desc');
    return rows.map(toEntity);
  }

  async save(membership) {
    const [row] = await knex('memberships')
      .insert({
        client_id: membership.clientId,
        plan_id: membership.planId,
        start_date: membership.startDate,
        end_date: membership.endDate,
        status: membership.status,
      })
      .returning('*');
    Object.assign(membership, toEntity(row));
    return membership;
  }

  async update(membership) {
    const [row] = await knex('memberships')
      .where({ id: membership.id })
      .update({
        status: membership.status,
        end_date: membership.endDate,
        updated_at: knex.fn.now(),
      })
      .returning('*');
    Object.assign(membership, toEntity(row));
    return membership;
  }
}

module.exports = PostgresMembershipRepository;
