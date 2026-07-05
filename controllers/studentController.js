const Student = require('../models/Student');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

// Generate JWT for student
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin: Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Public: Register a new student
// @route   POST /api/students/signup
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { studentId, password, name, email, phone } = req.body;

    const studentExists = await Student.findOne({ studentId });
    if (studentExists) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const emailExists = await Student.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const student = await Student.create({
      studentId,
      password,
      name,
      email,
      phone,
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: Create a new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  try {
    const { studentId, password, name, email, phone, address, photo, currentClass, attendance } = req.body;

    // Check if student exists
    const studentExists = await Student.findOne({ studentId });
    if (studentExists) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const emailExists = await Student.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const student = await Student.create({
      studentId,
      password,
      name,
      email,
      phone,
      address,
      photo,
      currentClass,
      attendance
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        currentClass: student.currentClass
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.phone = req.body.phone || student.phone;
      student.address = req.body.address || student.address;
      student.photo = req.body.photo || student.photo;
      student.currentClass = req.body.currentClass || student.currentClass;
      student.attendance = req.body.attendance !== undefined ? req.body.attendance : student.attendance;
      student.isActive = req.body.isActive !== undefined ? req.body.isActive : student.isActive;
      
      if (req.body.feeDetails) {
        student.feeDetails = req.body.feeDetails;
      }
      if (req.body.semesters) {
        student.semesters = req.body.semesters;
      }
      if (req.body.admitCardUrl !== undefined) {
        student.admitCardUrl = req.body.admitCardUrl;
      }

      // Allow password update if provided
      if (req.body.password) {
        student.password = req.body.password;
      }

      const updatedStudent = await student.save();

      res.json({
        _id: updatedStudent._id,
        studentId: updatedStudent.studentId,
        name: updatedStudent.name,
        currentClass: updatedStudent.currentClass
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ==========================================
// STUDENT FACING ROUTES
// ==========================================

// @desc    Student Auth & get token
// @route   POST /api/students/login
// @access  Public
const authStudent = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({ studentId }).select('+password');

    if (student && (await student.matchPassword(password))) {
      if (!student.isActive) {
        return res.status(401).json({ message: 'Account disabled. Contact administration.' });
      }

      res.json({
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        photo: student.photo,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Student ID or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in student profile
// @route   GET /api/students/me
// @access  Private/Student
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update logged in student profile
// @route   PUT /api/students/me
// @access  Private/Student
const updateStudentProfileSelf = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.phone = req.body.phone || student.phone;
      student.address = req.body.address || student.address;
      if (req.body.photo !== undefined) {
        student.photo = req.body.photo;
      }

      if (req.body.password) {
        student.password = req.body.password;
      }

      const updatedStudent = await student.save();

      // Log the activity for admin notifications
      try {
        await Activity.create({
          action: 'Updated',
          entity: 'Student Profile',
          details: `Student ${updatedStudent.name} (${updatedStudent.studentId}) updated their profile.`,
          user: `Student ${updatedStudent.studentId}`
        });
      } catch (err) {
        console.error('Failed to log activity:', err);
      }

      res.json({
        _id: updatedStudent._id,
        studentId: updatedStudent.studentId,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
        address: updatedStudent.address,
        photo: updatedStudent.photo,
        currentClass: updatedStudent.currentClass,
        token: generateToken(updatedStudent._id),
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  authStudent,
  getStudentProfile,
  updateStudentProfileSelf,
  registerStudent,
};
