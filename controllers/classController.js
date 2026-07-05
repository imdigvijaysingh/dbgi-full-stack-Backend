const CourseClass = require('../models/CourseClass');
const logActivity = require('../utils/logger');

// @desc    Get all classes
// @route   GET /api/v1/classes
// @access  Public (or Private depending on needs)
exports.getClasses = async (req, res, next) => {
  try {
    const classes = await CourseClass.find().sort({ courseName: 1, semester: 1 });
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single class
// @route   GET /api/v1/classes/:id
// @access  Public
exports.getClass = async (req, res, next) => {
  try {
    const courseClass = await CourseClass.findById(req.params.id);

    if (!courseClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    res.status(200).json({
      success: true,
      data: courseClass
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new class
// @route   POST /api/v1/classes
// @access  Private (Admin)
exports.createClass = async (req, res, next) => {
  try {
    const courseClass = await CourseClass.create(req.body);
    
    // Log activity
    await logActivity('Created', 'Classes', `Created class: ${courseClass.courseName} - ${courseClass.semester}`, req.user.username);

    res.status(201).json({
      success: true,
      data: courseClass
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update class
// @route   PUT /api/v1/classes/:id
// @access  Private (Admin)
exports.updateClass = async (req, res, next) => {
  try {
    const courseClass = await CourseClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!courseClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    // Log activity
    await logActivity('Updated', 'Classes', `Updated class: ${courseClass.courseName} - ${courseClass.semester}`, req.user.username);

    res.status(200).json({
      success: true,
      data: courseClass
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete class
// @route   DELETE /api/v1/classes/:id
// @access  Private (Admin)
exports.deleteClass = async (req, res, next) => {
  try {
    const courseClass = await CourseClass.findById(req.params.id);

    if (!courseClass) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    await courseClass.deleteOne();

    // Log activity
    await logActivity('Deleted', 'Classes', `Deleted class: ${courseClass.courseName} - ${courseClass.semester}`, req.user.username);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
