const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['analytics', 'hiring', 'activity'],
    default: 'analytics'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
