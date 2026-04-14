import useAuthStore from '../store/authStore.js';

const PERMISSIONS = {
  admin:        { clients:'full', memberships:'full', payments:'full', metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'full', reports:'full', config:'full' },
  supervisor:   { clients:'full', memberships:'full', payments:'full', metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'-',    reports:'full', config:'-'    },
  profesor:     { clients:'full', memberships:'-',    payments:'-',    metrics:'full', attendance:'full', plans:'full', exercises:'full', users:'-',    reports:'read', config:'-'    },
  recepcionista:{ clients:'read', memberships:'read', payments:'-',    metrics:'-',    attendance:'full', plans:'-',    exercises:'-',    users:'-',    reports:'read', config:'-'    },
  cajero:       { clients:'-',    memberships:'full', payments:'full', metrics:'-',    attendance:'-',    plans:'-',    exercises:'-',    users:'-',    reports:'-',    config:'-'    },
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
