const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['Added', 'Updated', 'Deleted', 'Logged In', 'Logged Out', 'Backup']
  },
  entity: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    default: 'System'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);
