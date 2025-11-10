const express = require('express');
const router = express.Router();
const { mockPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validate, paymentSchema } = require('../middleware/validation');

// Mock Razorpay payment success
router.post('/mock', authenticate, validate(paymentSchema), mockPayment);

module.exports = router;

