const KNOWN_ERRORS = [
  'ClientNotFoundError',
  'PlanNotFoundError',
  'MembershipNotFoundError',
  'UserNotFoundError',
  'InvalidCredentialsError',
];

function errorMiddleware(err, req, res, next) {
  if (KNOWN_ERRORS.includes(err.name) && err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorMiddleware;
