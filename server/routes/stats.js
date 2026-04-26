const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const DailyPoint = require('../models/DailyPoint');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

// @route   GET api/stats/summary
// @desc    Get dashboard summary info
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('total_points level current_streak best_streak');
    const tasksCompleted = await Task.countDocuments({ user_id: req.user.id, is_completed: true });
    
    // Get past 7 days points history
    const history = await DailyPoint.find({ user_id: req.user.id })
                                    .sort({ date: -1 })
                                    .limit(7)
                                    .select('date points_earned');
    
    res.json({
      total_points: user.total_points,
      level: user.level,
      current_streak: user.current_streak,
      best_streak: user.best_streak,
      tasks_completed: tasksCompleted,
      history: history.reverse() // send chronological
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/stats/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
    try {
        const badges = await Achievement.find({ user_id: req.user.id })
                                        .sort({ earned_at: -1 });
        res.json(badges);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
