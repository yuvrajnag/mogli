const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { verifyToken } = require('../middleware/auth');
const History = require('../models/History');

const router = express.Router();

/**
 * GET /api/history
 * Fetch history for the logged-in user
 */
router.get(
  '/',
  verifyToken,
  asyncHandler(async (req, res) => {
    const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  })
);

module.exports = router;
