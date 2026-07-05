const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true // URL to PDF
  },
  targetClass: {
    type: String,
    required: true // e.g., 'B.Tech CSE - 6th Sem'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
