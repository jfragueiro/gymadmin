const ROLES = /** @type {const} */ ({
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  PROFESOR: 'profesor',
  RECEPCIONISTA: 'recepcionista',
  CAJERO: 'cajero',
});

const ROLES_LIST = ['admin', 'supervisor', 'profesor', 'recepcionista', 'cajero'];

const CLIENT_STATUS = /** @type {const} */ ({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
});

const PAYMENT_METHOD = /** @type {const} */ ({
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
});

const GENDER = /** @type {const} */ ({
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
});

module.exports = { ROLES, ROLES_LIST, CLIENT_STATUS, PAYMENT_METHOD, GENDER };
