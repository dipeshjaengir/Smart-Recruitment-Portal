const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interviewing', 'accepted', 'rejected'],
    default: 'applied'
  },
  aiScore: {
    overall: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 }
  },
  aiRecommendation: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Reject'],
    default: 'Average'
  },
  logs: [{
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    comment: { type: String, default: '' }
  }],
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
