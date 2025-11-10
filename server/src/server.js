require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true })); // URL encoded parser

// Serve static files from uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SakshamSetu API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      pwd: '/api/pwd',
      donor: '/api/donor',
      admin: '/api/admin',
      payment: '/api/payment',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

