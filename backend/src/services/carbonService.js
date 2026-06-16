const Activity = require('../models/Activity');
const CarbonRecord = require('../models/CarbonRecord');
const User = require('../models/User');
const calculateCarbon = require('../utils/calculateCarbon');

// Helper to award points and check badges
const awardPointsAndCheckBadges = async (user, activity, totalEmission) => {
  let pointsEarned = 10; // Base points for logging

  // Eco-friendly transport bonus
  if (['Bike', 'Walk', 'Public Transport'].includes(activity.transportType)) {
    pointsEarned += 15;
  }
  // Eco-friendly food bonus
  if (['Vegan', 'Vegetarian'].includes(activity.foodType)) {
    pointsEarned += 10;
  }
  // Water-saving bonus (less than 50 Litres)
  if (activity.waterUsage > 0 && activity.waterUsage < 50) {
    pointsEarned += 10;
  }
  // Low emissions overall bonus
  if (totalEmission < 10) {
    pointsEarned += 20;
  } else if (totalEmission < 25) {
    pointsEarned += 10;
  }

  user.greenPoints += pointsEarned;

  // Badge thresholds
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
  return pointsEarned;
};

// Create a carbon entry
const createCarbonEntry = async (userId, activityData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // 1. Save Activity
  const activity = new Activity({
    userId,
    ...activityData,
    date: activityData.date || new Date()
  });
  await activity.save();

  // 2. Calculate Carbon Emissions
  const calculations = calculateCarbon(activity);

  // 3. Save Carbon Record
  const carbonRecord = new CarbonRecord({
    userId,
    activityId: activity._id,
    ...calculations,
    date: activity.date
  });
  await carbonRecord.save();

  // 4. Award points and check badges
  const pointsEarned = await awardPointsAndCheckBadges(user, activity, calculations.totalEmission);

  return {
    activity,
    carbonRecord,
    pointsEarned,
    totalPoints: user.greenPoints,
    badges: user.badges
  };
};

// Get all carbon records for a user
const getUserRecords = async (userId) => {
  return await CarbonRecord.find({ userId }).populate('activityId').sort({ date: -1 });
};

module.exports = {
  createCarbonEntry,
  getUserRecords
};
