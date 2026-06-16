const Goal = require('../models/Goal');
const CarbonRecord = require('../models/CarbonRecord');

// @desc    Get all user goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });

    // Update current emissions dynamically for each goal based on logs since creation
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        const records = await CarbonRecord.find({
          userId: req.user._id,
          date: { $gte: goal.createdAt }
        });

        const totalSinceCreated = records.reduce((sum, r) => sum + r.totalEmission, 0);
        goal.currentEmission = parseFloat(totalSinceCreated.toFixed(2));

        // Auto-complete or handle status (optional helper)
        if (goal.status === 'IN_PROGRESS' && goal.currentEmission >= goal.targetEmission) {
          // If emissions exceed target, user might have failed the goal if it was a budget.
          // Wait, let's keep it IN_PROGRESS for user manual status or just leave it.
        }

        await goal.save();
        return goal;
      })
    );

    res.json({
      success: true,
      data: updatedGoals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { targetEmission } = req.body;

    if (!targetEmission) {
      return res.status(400).json({ success: false, message: 'Please provide a target emission value' });
    }

    // Set initial currentEmission based on records since beginning of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const records = await CarbonRecord.find({
      userId: req.user._id,
      date: { $gte: startOfMonth }
    });

    const currentEmission = records.reduce((sum, r) => sum + r.totalEmission, 0);

    const goal = await Goal.create({
      userId: req.user._id,
      targetEmission,
      currentEmission: parseFloat(currentEmission.toFixed(2)),
      status: 'IN_PROGRESS'
    });

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a goal status/target
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const { targetEmission, status } = req.body;
    let goal = await Goal.findById(goalId = req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (targetEmission) goal.targetEmission = targetEmission;
    if (status) goal.status = status;

    await goal.save();

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await goal.deleteOne();

    res.json({
      success: true,
      message: 'Goal removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
