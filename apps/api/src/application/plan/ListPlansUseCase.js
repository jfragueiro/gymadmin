class ListPlansUseCase {
  constructor({ planRepository }) {
    this.planRepository = planRepository;
  }

  async execute() {
    return this.planRepository.findAll();
  }
}

module.exports = ListPlansUseCase;
