function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Administrative privileges required.'
    });
  }
  next();
}

module.exports = {
  requireAdmin
};
