class ClientNotFoundError extends Error {
  constructor(id) {
    super(`Client not found: ${id}`);
    this.name = 'ClientNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = ClientNotFoundError;
