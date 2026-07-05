const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  authStudent,
  getStudentProfile,
  updateStudentProfileSelf,
  registerStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/studentAuthMiddleware');

// Student facing routes
router.post('/login', authStudent);
router.post('/signup', registerStudent);
router.route('/me')
  .get(protectStudent, getStudentProfile)
  .put(protectStudent, updateStudentProfileSelf);

// Admin routes
router.route('/')
  .get(protect, getStudents)
  .post(protect, createStudent);

router.route('/:id')
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

module.exports = router;
