const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

// @desc    Create a new assignment (Admin)
// @route   POST /api/v1/assignments
// @access  Private/Admin
const createAssignment = async (req, res) => {
  try {
    const { title, description, fileUrl, targetClass } = req.body;
    const assignment = await Assignment.create({ title, description, fileUrl, targetClass });
    
    // Auto-generate notification for the class
    await Notification.create({
      title: `New Assignment: ${title}`,
      message: `A new assignment has been uploaded: ${description}`,
      targetType: 'class',
      targetId: targetClass
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get assignments for logged in student
// @route   GET /api/v1/assignments/my
// @access  Private/Student
const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student || !student.currentClass) {
       return res.json([]);
    }
    
    const assignments = await Assignment.find({ targetClass: student.currentClass.className }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createAssignment, getMyAssignments };
