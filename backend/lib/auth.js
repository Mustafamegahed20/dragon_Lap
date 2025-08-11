const jwt = require('jsonwebtoken');

// Rate limiting for auth endpoints (simple implementation)
const authAttempts = new Map();

const rateLimitAuth = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const attempts = authAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  
  // Reset if 15 minutes have passed
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  if (attempts.count >= 5) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  
  authAttempts.set(ip, { count: attempts.count + 1, lastAttempt: Date.now() });
  next();
};

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dragonlap_secret_key');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dragonlap_secret_key');
    req.user = decoded;
    next();
  } catch {
    req.user = null;
    next();
  }
};

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

module.exports = {
  rateLimitAuth,
  authMiddleware,
  adminMiddleware,
  optionalAuthMiddleware,
  validateEmail,
  validatePassword,
  authAttempts
};