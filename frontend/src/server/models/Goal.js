const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetEmission: {
    type: Number,
    required: [true, 'Please add a target emission value']
  },
  currentEmission: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'IN_PROGRESS'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
