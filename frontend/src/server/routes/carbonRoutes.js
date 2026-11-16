const express = require('express');
const router = express.Router();
const { logActivity, getLogs, getStats } = require('../controllers/carbonController');
const { protect } = require('../middleware/authMiddleware');

router.post('/log', protect, logActivity);
router.get('/logs', protect, getLogs);
router.get('/stats', protect, getStats);

module.exports = router;
