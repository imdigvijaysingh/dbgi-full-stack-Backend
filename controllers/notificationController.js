const Notification = require('../models/Notification');
const Student = require('../models/Student');

// @desc    Create a new notification (Admin)
// @route   POST /api/v1/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
  try {
    const { title, message, targetType, targetId } = req.body;
    const notification = await Notification.create({ title, message, targetType, targetId });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get notifications for logged in student
// @route   GET /api/v1/notifications/my
// @access  Private/Student
const getMyNotifications = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student) {
       return res.status(404).json({ message: 'Student not found' });
    }
    
    const classQuery = student.currentClass ? student.currentClass.className : null;
    
    const queryConditions = [
      { targetType: 'all' },
      { targetType: 'student', targetId: student.studentId }
    ];
    
    if (classQuery) {
      queryConditions.push({ targetType: 'class', targetId: classQuery });
    }

    const notifications = await Notification.find({
      $or: queryConditions
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createNotification, getMyNotifications };
