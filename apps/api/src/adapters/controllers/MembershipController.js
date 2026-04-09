const {
  assignPlanUseCase,
  getClientMembershipsUseCase,
  getClientsWithMembershipUseCase,
} = require('../../infrastructure/container');

class MembershipController {
  async assign(req, res, next) {
    try {
      const membership = await assignPlanUseCase.execute(req.body);
      res.status(201).json(membership);
    } catch (err) {
      next(err);
    }
  }

  async getByClient(req, res, next) {
    try {
      const memberships = await getClientMembershipsUseCase.execute({ clientId: req.params.clientId });
      res.json(memberships);
    } catch (err) {
      next(err);
    }
  }

  async getAllWithMembership(req, res, next) {
    try {
      const data = await getClientsWithMembershipUseCase.execute();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MembershipController();
