const mongoose = require('mongoose');

const carbonRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  transportEmission: {
    type: Number,
    required: true
  },
  electricityEmission: {
    type: Number,
    required: true
  },
  waterEmission: {
    type: Number,
    required: true
  },
  foodEmission: {
    type: Number,
    required: true
  },
  wasteEmission: {
    type: Number,
    required: true
  },
  totalEmission: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarbonRecord', carbonRecordSchema);
