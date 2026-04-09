class GetClientsWithMembershipUseCase {
  constructor({ membershipRepository }) {
    this.membershipRepository = membershipRepository;
  }

  async execute() {
    return this.membershipRepository.findAllClientsWithActiveMembership();
  }
}

module.exports = GetClientsWithMembershipUseCase;
