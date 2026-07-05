const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logActivity = require('../utils/logger');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public (or Private depending on CMS setup)
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email/username and password' });
    }

    // Check for user (by email or username)
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    await logActivity('Logged In', 'Session', `User logged in`, user.username);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update user credentials
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateCredentials = async (req, res, next) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // If trying to change password
    if (currentPassword && newPassword) {
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ success: false, error: 'Incorrect current password' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (username) {
      user.username = username;
    }

    await user.save();

    await logActivity('Updated', 'Profile', `Admin updated credentials`, user.username);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get total count of users
// @route   GET /api/v1/auth/users/count
// @access  Private
exports.getUsersCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
