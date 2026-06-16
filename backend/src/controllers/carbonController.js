const carbonService = require('../services/carbonService');
const CarbonRecord = require('../models/CarbonRecord');

// @desc    Log a new activity & calculate carbon
// @route   POST /api/carbon/log
// @access  Private
const logActivity = async (req, res) => {
  try {
    const result = await carbonService.createCarbonEntry(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user activity carbon records
// @route   GET /api/carbon/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    const logs = await carbonService.getUserRecords(req.user._id);
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get carbon emission stats/summary
// @route   GET /api/carbon/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate emissions grouped by category
    const stats = await CarbonRecord.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalTransport: { $sum: '$transportEmission' },
          totalElectricity: { $sum: '$electricityEmission' },
          totalFood: { $sum: '$foodEmission' },
          totalWaste: { $sum: '$wasteEmission' },
          totalEmissions: { $sum: '$totalEmission' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || {
      totalTransport: 0,
      totalElectricity: 0,
      totalFood: 0,
      totalWaste: 0,
      totalEmissions: 0,
      count: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logActivity,
  getLogs,
  getStats
};
