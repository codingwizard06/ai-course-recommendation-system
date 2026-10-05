const jwt = require('jsonwebtoken');
const db = require('../db/datastore');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_course_recommender_super_secret_jwt_key_2026';

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Authentication required. Missing token.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User account no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  requireAuth,
  generateToken,
  JWT_SECRET
};
