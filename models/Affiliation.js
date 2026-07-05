const mongoose = require('mongoose');

const AffiliationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the affiliation (e.g., AICTE)'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Affiliation', AffiliationSchema);
