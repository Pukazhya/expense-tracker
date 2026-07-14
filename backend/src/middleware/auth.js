const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) return res.status(401).json({ message: 'Authentication token is required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.userId);
    if (!req.user) return res.status(401).json({ message: 'User account no longer exists' });
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};
