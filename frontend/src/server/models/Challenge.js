const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED'],
    default: 'ACTIVE'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a challenge title'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  rewardPoints: {
    type: Number,
    default: 100
  },
  duration: {
    type: String,
    default: '7 Days'
  },
  participants: [participantSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
