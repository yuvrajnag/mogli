const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mogli-secret-key-123';

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
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

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      credits: 150
    });

    if (user) {
      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
      });

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          credits: user.credits
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  })
);

module.exports = router;
