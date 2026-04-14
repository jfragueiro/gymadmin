const constants = require('./constants');
const types = require('./types');
const { PERMISSIONS, hasPermission } = require('./permissions');

module.exports = { ...constants, ...types, PERMISSIONS, hasPermission };
