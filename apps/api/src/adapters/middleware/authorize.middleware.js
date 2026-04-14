const { hasPermission } = require('@gymadmin/shared');

const authorize = (module, required = 'read') => (req, res, next) => {
  const role = req.user?.role;
  if (!role) return res.status(401).json({ error: 'No autenticado' });
  if (!hasPermission(role, module, required)) {
    return res.status(403).json({ error: 'Sin permisos suficientes' });
  }
  next();
};

module.exports = authorize;
