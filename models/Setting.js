const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'My CMS Site'
  },
  siteLogo: {
    type: String
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  contactEmail: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', SettingSchema);
