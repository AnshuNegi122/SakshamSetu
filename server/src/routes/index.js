const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const pwdRoutes = require('./pwdRoutes');
const donorRoutes = require('./donorRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SakshamSetu API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/pwd', pwdRoutes);
router.use('/donor', donorRoutes);
router.use('/admin', adminRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;

