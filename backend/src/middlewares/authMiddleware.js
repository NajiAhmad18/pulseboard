const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Middleware to protect routes (Authentication)
const protect = async (req, res, next) => {
  let token;

  // Check cookie for JWT
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to req object (without password)
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      next(new AppError('Not authorized, token failed', 401));
    }
  } else {
    next(new AppError('Not authorized, no token', 401));
  }
};

// Middleware for role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize };
