export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ObjectID error
  if (err.name === 'CastError') {
    const message = `Resource not found with this ID. Invalid: ${err.path}`;
    err.statusCode = 400;
    err.message = message;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    err.statusCode = 400;
    err.message = message;
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token';
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expired';
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    err.statusCode = 400;
    err.message = errors;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
