const express = require('express');
const router = express.Router();
const { registerUser, verifyRegisterOtp, loginUser, verifyLoginOtp, getUserProfile, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/register/verify', verifyRegisterOtp);
router.post('/login', loginUser);
router.post('/login/verify', verifyLoginOtp);
router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);

module.exports = router;
