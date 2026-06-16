const User = require('../models/User');
const OtpCode = require('../models/OtpCode');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

// Helper to generate a random 6-digit OTP code
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Request registration & send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Generate and send OTP
    const otp = generateOtpCode();
    await sendOtpEmail(email, otp, 'register');

    // Store in temp OtpCode db model
    await OtpCode.deleteMany({ email, action: 'REGISTER' }); // Clean old requests
    await OtpCode.create({
      email,
      otp,
      name,
      password,
      action: 'REGISTER'
    });

    res.status(200).json({
      success: true,
      otpSent: true,
      message: 'Verification code sent to your email address'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify registration OTP & create user account
// @route   POST /api/auth/register/verify
// @access  Public
const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and verification code' });
    }

    const record = await OtpCode.findOne({ email, otp, action: 'REGISTER' });
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Create user
    const user = await User.create({
      name: record.name,
      email: record.email,
      password: record.password
    });

    // Delete temp OTP record
    await OtpCode.deleteOne({ _id: record._id });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenPoints: user.greenPoints,
        badges: user.badges,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & send 2FA OTP
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Credentials valid, send 2FA code
    const otp = generateOtpCode();
    await sendOtpEmail(email, otp, 'login');

    // Store in temp OtpCode db model
    await OtpCode.deleteMany({ email, action: 'LOGIN' }); // Clean old requests
    await OtpCode.create({
      email,
      otp,
      action: 'LOGIN'
    });

    res.status(200).json({
      success: true,
      otpSent: true,
      message: '2FA security verification code sent to your email'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 2FA OTP & issue login session token
// @route   POST /api/auth/login/verify
// @access  Public
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and verification code' });
    }

    const record = await OtpCode.findOne({ email, otp, action: 'LOGIN' });
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired 2FA verification code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Delete temp OTP record
    await OtpCode.deleteOne({ _id: record._id });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenPoints: user.greenPoints,
        badges: user.badges,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          greenPoints: user.greenPoints,
          badges: user.badges
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user via Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { token, name: fallbackName, email: fallbackEmail } = req.body;

    let email = fallbackEmail;
    let name = fallbackName;

    // Perform proper Google ID Token verification if token is provided
    if (token && process.env.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      } catch (verificationError) {
        console.error('Google token verification failed:', verificationError.message);
        return res.status(401).json({ success: false, message: 'Google Authentication failed: invalid token signature' });
      }
    } else {
      if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Please provide Google profile details or a valid token' });
      }
      console.warn('GOOGLE_CLIENT_ID is not configured. Falling back to simulated verification.');
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
      user = await User.create({
        name,
        email,
        password: randomPassword
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenPoints: user.greenPoints,
        badges: user.badges,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  verifyLoginOtp,
  getUserProfile,
  googleLogin
};
