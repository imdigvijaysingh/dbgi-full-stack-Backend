const Student = require('../models/Student');
const CourseClass = require('../models/CourseClass');

// @desc    Get students by class string (CourseName - Semester) for attendance
// @route   GET /api/v1/attendance/students
// @access  Private/Admin
const getStudentsByClass = async (req, res) => {
  try {
    const { classString } = req.query; // e.g. "B.Tech CSE - 7th Sem"
    if (!classString) {
      return res.status(400).json({ message: 'Class string is required' });
    }

    const [courseName, semester] = classString.split(' - ');

    const students = await Student.find({ 
      'currentClass.className': courseName,
      'currentClass.semester': semester,
      isActive: true
    }).select('studentId name currentClass attendanceRecords');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Bulk update attendance
// @route   PUT /api/v1/attendance/bulk
// @access  Private/Admin
const bulkUpdateAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    // records: [{ studentId, subject, month, totalClasses, attendedClasses }]

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Invalid records format' });
    }

    for (const record of records) {
      const student = await Student.findById(record.studentId);
      if (student) {
        // Calculate percentage
        const percentage = record.totalClasses > 0 ? ((record.attendedClasses / record.totalClasses) * 100).toFixed(2) : 0;
        
        // Check if attendance record for subject and month already exists
        const existingRecordIndex = student.attendanceRecords.findIndex(
          r => r.subject === record.subject && r.month === record.month
        );

        if (existingRecordIndex !== -1) {
          // Update existing
          student.attendanceRecords[existingRecordIndex].totalClasses = record.totalClasses;
          student.attendanceRecords[existingRecordIndex].attendedClasses = record.attendedClasses;
          student.attendanceRecords[existingRecordIndex].percentage = parseFloat(percentage);
        } else {
          // Add new
          student.attendanceRecords.push({
            subject: record.subject,
            month: record.month,
            totalClasses: record.totalClasses,
            attendedClasses: record.attendedClasses,
            percentage: parseFloat(percentage)
          });
        }
        await student.save();
      }
    }

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error("Bulk update attendance error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getStudentsByClass, bulkUpdateAttendance };
