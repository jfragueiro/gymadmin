const { z } = require('zod');
const { ROLES_LIST } = require('@gymadmin/shared');

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(ROLES_LIST),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(ROLES_LIST).optional(),
});

const updateOwnProfileSchema = z.object({
  name: z.string().min(2).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

const toggleStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = { createUserSchema, updateUserSchema, updateOwnProfileSchema, toggleStatusSchema };
