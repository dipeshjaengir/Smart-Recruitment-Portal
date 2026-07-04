const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  cgpa: { type: String }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  link: { type: String }
});

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String },
  date: { type: String }
});

const candidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  certificates: [certificateSchema],
  resumeUrl: {
    type: String,
    default: ''
  },
  profileImageUrl: {
    type: String,
    default: ''
  },
  parsedResumeData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  profileCompletion: {
    type: Number,
    default: 0
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

candidateSchema.pre('save', function (next) {
  let score = 0;
  if (this.name) score += 10;
  if (this.phone) score += 10;
  if (this.title) score += 10;
  if (this.bio) score += 10;
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.education && this.education.length > 0) score += 15;
  if (this.experience && this.experience.length > 0) score += 15;
  if (this.resumeUrl) score += 15;
  this.profileCompletion = score;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);
