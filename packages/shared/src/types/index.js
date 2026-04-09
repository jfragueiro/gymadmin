/**
 * @typedef {'admin' | 'coach'} Role
 * @typedef {'active' | 'inactive' | 'suspended'} ClientStatus
 * @typedef {'cash' | 'card' | 'transfer'} PaymentMethod
 * @typedef {'male' | 'female' | 'other'} Gender
 *
 * @typedef {Object} ClientDTO
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} birth_date
 * @property {Gender} gender
 * @property {string|null} photo_url
 * @property {number|null} coach_id
 * @property {ClientStatus} status
 *
 * @typedef {Object} UserDTO
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {Role} role
 * @property {boolean} is_active
 */

module.exports = {};
