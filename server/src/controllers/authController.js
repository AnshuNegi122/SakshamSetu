const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const Notification = require('../models/Notification');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, location, disabilityType, udidNumber, consent } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, role, and location are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Prepare user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save hook
      role,
      location: location.trim(),
      consent: consent !== undefined ? consent : false,
      udidVerified: false,
    };

    // Add PwD specific fields only if role is PwD
    if (role === 'PwD') {
      if (disabilityType && disabilityType.trim()) {
        userData.disabilityType = disabilityType.trim();
      }
      if (udidNumber && udidNumber.trim()) {
        userData.udidNumber = udidNumber.trim();
      }
    }

    // Create new user
    const user = new User(userData);

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Create welcome notification
    try {
      await Notification.create({
        userId: user._id,
        title: 'Welcome to SakshamSetu!',
        message: `Welcome ${name}! Your account has been created successfully.`,
        type: 'Success',
      });
    } catch (notifError) {
      // Don't fail registration if notification fails
      console.error('Failed to create notification:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Create login notification
    try {
      await Notification.create({
        userId: user._id,
        title: 'Login Successful',
        message: 'You have successfully logged into your account.',
        type: 'Success',
      });
    } catch (notifError) {
      // Don't fail login if notification fails
      console.error('Failed to create notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side token clearing, server can log this)
 */
const logout = async (req, res, next) => {
  try {
    // In a stateless JWT setup, logout is handled client-side
    // But we can log the logout event or invalidate refresh tokens if stored in DB
    res.json({
      success: true,
      message: 'Logout successful. Please clear tokens on client side.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
