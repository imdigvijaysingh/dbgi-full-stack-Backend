const Notice = require('../models/Notice');
const logActivity = require('../utils/logger');

// @desc    Get all active notices
// @route   GET /api/v1/notices
// @access  Public
exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all notices (including inactive)
// @route   GET /api/v1/notices/all
// @access  Private
exports.getAllNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort('-createdAt');
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new notice
// @route   POST /api/v1/notices
// @access  Private
exports.createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create(req.body);
    await logActivity('Added', 'Notice', `"${notice.title}"`, req.user || 'Admin User');
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/v1/notices/:id
// @access  Private
exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!notice) {
      return res.status(404).json({ success: false, error: 'Notice not found' });
    }

    await logActivity('Updated', 'Notice', `"${notice.title}"`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/v1/notices/:id
// @access  Private
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, error: 'Notice not found' });
    }

    await logActivity('Deleted', 'Notice', `"${notice.title}"`, req.user || 'Admin User');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
