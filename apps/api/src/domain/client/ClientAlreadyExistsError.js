class ClientAlreadyExistsError extends Error {
  constructor(field = 'documento') {
    super(`Ya existe un cliente registrado con ese ${field}`);
    this.name = 'ClientAlreadyExistsError';
    this.statusCode = 409;
  }
}

module.exports = ClientAlreadyExistsError;
