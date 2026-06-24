const express = require('express');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mogli-secret-key-123';

// In-memory mock database for simplicity right now
// In a real scenario, you would use Mongoose/MongoDB here.
const users = [
  {
    id: 'user_1',
    name: 'Demo User',
    email: 'demo@mogli.com',
    password: 'password123',
    credits: 150
  }
];

/**
 * POST /api/auth/login
 * Validates credentials and returns a JWT
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    });
  })
);

/**
 * POST /api/auth/signup
 * Creates a mock user and returns a JWT
 */
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In real scenario: hash this password using bcrypt!
      credits: 150
    };

    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        credits: newUser.credits
      }
    });
  })
);

module.exports = router;
