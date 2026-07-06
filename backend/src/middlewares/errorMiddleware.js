const AppError = require('../utils/AppError');
const sendResponse = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token, please log in again', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired, please log in again', 401);
  }

  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    status: error.status || 'error',
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
