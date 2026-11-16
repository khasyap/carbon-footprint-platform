const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Default challenges list for seeding
const DEFAULT_CHALLENGES = [
  {
    title: 'No Plastic Week',
    description: 'Avoid buying single-use plastics for an entire week. Use reusable bags and bottles.',
    rewardPoints: 100,
    duration: '7 Days'
  },
  {
    title: 'Bike To Work',
    description: 'Commute to work or school using a bicycle instead of a car at least 3 times this week.',
    rewardPoints: 150,
    duration: '7 Days'
  },
  {
    title: 'Save Electricity',
    description: 'Reduce your electricity units by 15% this week by switching off idle appliances.',
    rewardPoints: 100,
    duration: '7 Days'
  },
  {
    title: 'Zero Waste Weekend',
    description: 'Ensure no trash goes to the landfill for 48 hours by composting and recycling everything.',
    rewardPoints: 120,
    duration: '2 Days'
  }
];

// @desc    Get all challenges (auto-seed if empty)
// @route   GET /api/challenges
// @access  Private
const getChallenges = async (req, res) => {
  try {
    let challenges = await Challenge.find({});

    // Auto seed if empty
    if (challenges.length === 0) {
      await Challenge.insertMany(DEFAULT_CHALLENGES);
      challenges = await Challenge.find({});
    }

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Check if already joined
    const alreadyJoined = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }

    challenge.participants.push({
      userId: req.user._id,
      status: 'ACTIVE',
      joinedAt: new Date()
    });

    await challenge.save();

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      data: challenge
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a challenge
// @route   POST /api/challenges/:id/complete
// @access  Private
const completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Find participation
    const participation = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!participation) {
      return res.status(400).json({ success: false, message: 'You have not joined this challenge yet' });
    }

    if (participation.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Challenge already completed' });
    }

    // Update status
    participation.status = 'COMPLETED';
    await challenge.save();

    // Award points and check badges
    const user = await User.findById(req.user._id);
    user.greenPoints += challenge.rewardPoints;

    // Check and add badges based on updated greenPoints
    const badgeThresholds = [
      { name: 'Green Beginner', threshold: 1 },
      { name: 'Carbon Saver', threshold: 100 },
      { name: 'Eco Warrior', threshold: 500 },
      { name: 'Sustainability Champion', threshold: 1000 }
    ];

    badgeThresholds.forEach(b => {
      if (user.greenPoints >= b.threshold && !user.badges.includes(b.name)) {
        user.badges.push(b.name);
      }
    });

    await user.save();

    res.json({
      success: true,
      message: `Challenge completed! You earned ${challenge.rewardPoints} points.`,
      data: {
        challenge,
        user: {
          greenPoints: user.greenPoints,
          badges: user.badges
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChallenges,
  joinChallenge,
  completeChallenge
};
