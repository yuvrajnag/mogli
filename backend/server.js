require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

// Import route modules
const generateRoutes = require('./routes/generate');
const chatRoutes = require('./routes/chat');
const enhanceRoutes = require('./routes/enhance');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '10mb' }));

// --- API Routes ---
app.use('/api', generateRoutes);
app.use('/api', chatRoutes);
app.use('/api', enhanceRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mogli API is running' });
});

// --- Error Handling ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`\n  🐒  Mogli API Server running on http://localhost:${PORT}`);
  console.log(`  📡  Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  console.log(`  🔑  Groq API Key: ${process.env.GROQ_API_KEY ? '✓ loaded' : '✗ MISSING'}`);
  console.log(`  🔑  HF API Key:   ${process.env.HF_API_KEY ? '✓ loaded' : '✗ MISSING'}\n`);
});
