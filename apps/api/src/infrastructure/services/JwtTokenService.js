const jwt = require('jsonwebtoken');

class JwtTokenService {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = JwtTokenService;
