class InvalidDateRangeError extends Error {
  constructor(message = 'startDate y endDate son requeridos') {
    super(message);
    this.name = 'InvalidDateRangeError';
    this.statusCode = 400;
  }
}

module.exports = InvalidDateRangeError;
