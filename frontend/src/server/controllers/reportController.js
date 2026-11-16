const CarbonRecord = require('../models/CarbonRecord');
const Goal = require('../models/Goal');
const User = require('../models/User');

// @desc    Get dashboard analytics & reports
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Date calculations
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);

    // 1. Weekly & Monthly total emissions
    const weeklyRecords = await CarbonRecord.find({
      userId,
      date: { $gte: oneWeekAgo }
    });

    const monthlyRecords = await CarbonRecord.find({
      userId,
      date: { $gte: oneMonthAgo }
    });

    const weeklyTotal = parseFloat(weeklyRecords.reduce((sum, r) => sum + r.totalEmission, 0).toFixed(2));
    const monthlyTotal = parseFloat(monthlyRecords.reduce((sum, r) => sum + r.totalEmission, 0).toFixed(2));

    // 2. Weekly breakdown
    let wTransport = 0, wElectricity = 0, wWater = 0, wFood = 0, wWaste = 0;
    weeklyRecords.forEach(r => {
      wTransport += r.transportEmission;
      wElectricity += r.electricityEmission;
      wWater += r.waterEmission || 0;
      wFood += r.foodEmission;
      wWaste += r.wasteEmission;
    });

    // 3. Emission Trend (Past 7 Days)
    const trendDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Filter records for this calendar day
      const dayRecords = weeklyRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.toDateString() === d.toDateString();
      });

      const transport = parseFloat(dayRecords.reduce((sum, r) => sum + r.transportEmission, 0).toFixed(2));
      const electricity = parseFloat(dayRecords.reduce((sum, r) => sum + r.electricityEmission, 0).toFixed(2));
      const water = parseFloat(dayRecords.reduce((sum, r) => sum + r.waterEmission || 0, 0).toFixed(2));
      const food = parseFloat(dayRecords.reduce((sum, r) => sum + r.foodEmission, 0).toFixed(2));
      const waste = parseFloat(dayRecords.reduce((sum, r) => sum + r.wasteEmission, 0).toFixed(2));
      const total = parseFloat(dayRecords.reduce((sum, r) => sum + r.totalEmission, 0).toFixed(2));

      trendDays.push({
        day: dayName,
        transport,
        energy: parseFloat((electricity + water).toFixed(2)),
        food,
        waste,
        total
      });
    }

    // 4. Sustainability Score
    // Formula: starts at 100, drops based on average weekly emissions, increases based on points
    const dailyAvg = weeklyRecords.length > 0 ? (weeklyTotal / 7) : 15;
    let score = 100 - (dailyAvg * 2.5); // 20kg daily avg means 50 score
    score += (user.greenPoints * 0.05); // Bonus from greenPoints
    const sustainabilityScore = Math.max(10, Math.min(100, Math.round(score)));

    // 5. Goal Progress
    const goals = await Goal.find({ userId });
    const goalProgress = await Promise.all(
      goals.map(async (g) => {
        const records = await CarbonRecord.find({
          userId,
          date: { $gte: g.createdAt }
        });
        const currentEmission = records.reduce((sum, r) => sum + r.totalEmission, 0);
        
        let percent = 0;
        if (g.targetEmission > 0) {
          // Progress is: how close is currentEmission to the target? 
          // If currentEmission is lower than target, they are doing good.
          // Let's compute percent as: Math.min(100, (currentEmission / g.targetEmission) * 100)
          percent = Math.min(100, Math.round((currentEmission / g.targetEmission) * 100));
        }

        return {
          _id: g._id,
          targetEmission: g.targetEmission,
          currentEmission: parseFloat(currentEmission.toFixed(2)),
          status: g.status,
          percent
        };
      })
    );

    res.json({
      success: true,
      data: {
        sustainabilityScore,
        weeklyTotal,
        monthlyTotal,
        weeklyBreakdown: {
          transport: parseFloat(wTransport.toFixed(2)),
          energy: parseFloat((wElectricity + wWater).toFixed(2)),
          food: parseFloat(wFood.toFixed(2)),
          waste: parseFloat(wWaste.toFixed(2))
        },
        emissionTrend: trendDays,
        goalProgress,
        greenPoints: user.greenPoints,
        badgesCount: user.badges.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardData
};
