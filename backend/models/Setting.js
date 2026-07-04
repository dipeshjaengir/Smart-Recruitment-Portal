const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Smart Recruitment Portal'
  },
  aiWeights: {
    skills: { type: Number, default: 35 },
    experience: { type: Number, default: 25 },
    education: { type: Number, default: 20 },
    keywords: { type: Number, default: 10 },
    projectsCertificates: { type: Number, default: 10 }
  },
  contactEmail: {
    type: String,
    default: 'support@smartrecruit.com'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Setting', settingSchema);
