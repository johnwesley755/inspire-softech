// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Seller only middleware
exports.sellerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller privileges required.'
    });
  }
  next();
};

// Super admin only middleware
exports.superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
  next();
};

// Seller or Super Admin middleware
exports.sellerOrSuperAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'seller' && req.user.role !== 'super_admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller or Super Admin privileges required.'
    });
  }
  next();
};

// Middleware to check if user has specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};


