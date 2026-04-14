class InvalidRoleError extends Error {
  constructor(role) {
    super(`Rol inválido: "${role}"`);
    this.name = 'InvalidRoleError';
    this.statusCode = 400;
  }
}

module.exports = InvalidRoleError;
