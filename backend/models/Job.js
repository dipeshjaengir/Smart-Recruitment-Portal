const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    trim: true
  },
  skillsRequired: [{
    type: String,
    required: true,
    trim: true
  }],
  experienceRequired: {
    type: Number,
    required: [true, 'Experience required in years is required'],
    default: 0
  },
  educationRequired: {
    type: String,
    required: [true, 'Education requirements are required'],
    trim: true
  },
  salaryMin: {
    type: Number,
    default: 0
  },
  salaryMax: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true
  },
  workMode: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'onsite'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
