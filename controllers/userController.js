const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logActivity = require('../utils/logger');

// @desc    Get all admin users
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new admin user
// @route   POST /api/v1/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin'
    });
    
    await logActivity('Created', 'Users', `Created admin user: ${user.username}`, req.user.username);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update admin user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updateData = { username, email, role };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    await logActivity('Updated', 'Users', `Updated admin user: ${user.username}`, req.user.username);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete admin user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, error: 'You cannot delete yourself.' });
    }

    await user.deleteOne();

    await logActivity('Deleted', 'Users', `Deleted admin user: ${user.username}`, req.user.username);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
