const geminiService = require('../services/geminiService');

// @desc    Get AI personalized recommendations
// @route   POST /api/ai/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendations = await geminiService.generateRecommendations(userId);
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations
};
