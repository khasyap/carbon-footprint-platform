const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transportType: {
    type: String,
    enum: ['Car', 'Public Transport', 'Bike', 'Walk', 'Motorcycle', 'None'],
    default: 'None'
  },
  distance: {
    type: Number,
    default: 0
  },
  electricityUnits: {
    type: Number,
    default: 0
  },
  waterUsage: {
    type: Number,
    default: 0
  },
  foodType: {
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Meat Heavy', 'Balanced', 'None'],
    default: 'None'
  },
  wasteGenerated: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
