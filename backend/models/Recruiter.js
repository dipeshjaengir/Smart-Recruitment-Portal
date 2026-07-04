const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Recruiter name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  companyWebsite: {
    type: String,
    trim: true,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    trim: true,
    default: ''
  },
  about: {
    type: String,
    trim: true,
    default: ''
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

recruiterSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Recruiter', recruiterSchema);
