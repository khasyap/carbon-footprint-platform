const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge, completeChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getChallenges);
router.post('/:id/join', protect, joinChallenge);
router.post('/:id/complete', protect, completeChallenge);

module.exports = router;
