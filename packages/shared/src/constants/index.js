const ROLES = /** @type {const} */ ({
  ADMIN: 'admin',
  COACH: 'coach',
});

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

module.exports = { ROLES, CLIENT_STATUS, PAYMENT_METHOD, GENDER };
