class PlanNotFoundError extends Error {
  constructor(id) {
    super(`Plan not found: ${id}`);
    this.name = 'PlanNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = PlanNotFoundError;
