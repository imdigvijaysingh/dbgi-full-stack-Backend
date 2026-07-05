const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add testimonial content']
  },
  author: {
    type: String,
    required: [true, 'Please add author name']
  },
  role: {
    type: String,
    required: [true, 'Please add author role']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
