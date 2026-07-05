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
    const classQuery = student.currentClass ? `${student.currentClass.className} - ${student.currentClass.semester}` : null;
    if (!classQuery) return res.json([]);
    
    const assignments = await Assignment.find({ targetClass: classQuery }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
};
// @desc    Get all assignments (Admin)
// @route   GET /api/v1/assignments
// @access  Private/Admin
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete assignment (Admin)
// @route   DELETE /api/v1/assignments/:id
// @access  Private/Admin
const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createAssignment, getMyAssignments, getAllAssignments, deleteAssignment };
