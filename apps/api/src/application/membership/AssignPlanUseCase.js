const Membership = require('../../domain/membership/Membership');
const ClientNotFoundError = require('../../domain/client/ClientNotFoundError');
const PlanNotFoundError = require('../../domain/plan/PlanNotFoundError');

class AssignPlanUseCase {
  constructor({ membershipRepository, clientRepository, planRepository }) {
    this.membershipRepository = membershipRepository;
    this.clientRepository = clientRepository;
    this.planRepository = planRepository;
  }

  async execute({ clientId, planId, startDate }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) throw new ClientNotFoundError(clientId);

    const plan = await this.planRepository.findById(planId);
    if (!plan) throw new PlanNotFoundError(planId);

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    const membership = Membership.create({
      clientId,
      planId,
      startDate: start,
      endDate: end,
      status: 'active',
    });

    await this.membershipRepository.save(membership);
    return membership;
  }
}

module.exports = AssignPlanUseCase;
