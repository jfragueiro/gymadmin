import useAuthStore from '../store/authStore.js';

const PERMISSIONS = {
  admin:        { clients:'full', memberships:'full', payments:'full', metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'full', reports:'full', config:'full', finances:'full' },
  supervisor:   { clients:'full', memberships:'full', payments:'full', metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'-',    reports:'full', config:'-',    finances:'read' },
  profesor:     { clients:'full', memberships:'-',    payments:'-',    metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'-',    reports:'read', config:'-',    finances:'-'    },
  recepcionista:{ clients:'read', memberships:'read', payments:'-',    metrics:'-',    attendance:'full', plans:'-',    exercises:'-',    users:'-',    reports:'read', config:'-',    finances:'-'    },
  cajero:       { clients:'-',    memberships:'full', payments:'full', metrics:'-',    attendance:'-',    plans:'-',    exercises:'-',    users:'-',    reports:'-',    config:'-',    finances:'-'    },
};

export function usePermission(module, required = 'read') {
  const user = useAuthStore((s) => s.user);
  const perm = PERMISSIONS[user?.role]?.[module];
  if (!perm || perm === '-') return false;
  if (perm === 'full') return true;
  return perm === required;
}

export function hasPermission(role, module, required = 'read') {
  const perm = PERMISSIONS[role]?.[module];
  if (!perm || perm === '-') return false;
  if (perm === 'full') return true;
  return perm === required;
}
