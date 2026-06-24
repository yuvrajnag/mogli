/**
 * Centralized error handling middleware for Express.
 * Catches errors thrown in route handlers and returns a consistent JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error('Server Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
}

/**
 * Wraps an async route handler so rejected promises are caught
 * and forwarded to the error handling middleware.
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
