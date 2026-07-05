const mongoose = require('mongoose');

const courseClassSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseClass', courseClassSchema);
