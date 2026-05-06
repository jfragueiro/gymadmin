class DeleteExpenseEntryUseCase {
  constructor({ entryRepository }) {
    this.entryRepository = entryRepository;
  }

  async execute({ entryId }) {
    await this.entryRepository.deleteById(entryId);
  }
}

module.exports = DeleteExpenseEntryUseCase;
