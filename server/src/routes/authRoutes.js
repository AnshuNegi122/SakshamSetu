const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;

