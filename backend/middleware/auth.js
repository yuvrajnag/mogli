const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./errorHandler');

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'mogli-secret-key-123';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token and attach user ID
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.userId };
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { verifyToken };
