const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  action: {
    type: String,
    required: true,
    enum: ['REGISTER', 'LOGIN']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically delete document after 10 minutes (600 seconds)
  }
});

module.exports = mongoose.model('OtpCode', otpCodeSchema);
