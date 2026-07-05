const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
  },
  size: {
    type: Number,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Media', MediaSchema);
