const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a notice title']
  },
  description: {
    type: String,
    required: [true, 'Please add a notice description']
  },
  link: {
    type: String,
    default: '#'
  },
  buttonText: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', NoticeSchema);
