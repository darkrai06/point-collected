const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const DailyPoint = require('../models/DailyPoint');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

const diffToPoints = {
  easy: 5,
  medium: 10,
  hard: 20,
  epic: 50,
  easy_penalty: -5,
  hard_penalty: -10
};

// @route   GET api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();
    // Determine the most recent 6 AM
    const last6AM = new Date();
    last6AM.setHours(6, 0, 0, 0);
    if (now < last6AM) {
      // If it's before 6 AM today, the last 6 AM was yesterday
      last6AM.setDate(last6AM.getDate() - 1);
    }

    const tasks = await Task.find({ user_id: req.user.id });
    
    // Check and reset tasks that were completed BEFORE the last 6 AM
    let hasUpdates = false;
    for (let task of tasks) {
      if (task.is_completed && task.completed_at) {
        const completedDate = new Date(task.completed_at);
        
        if (completedDate < last6AM) {
          // Completed before the last 6 AM -> Reset it!
          task.is_completed = false;
          task.completed_at = null;
          task.minutes = 1;
          await task.save();
          hasUpdates = true;
        }
      }
    }

    // Sort: Uncompleted first, then by created_at descending
    tasks.sort((a, b) => {
       if (a.is_completed !== b.is_completed) {
          return a.is_completed ? 1 : -1;
       }
       return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Add new task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, difficulty, due_date, custom_points } = req.body;
  const basePoints = difficulty === 'custom' ? parseInt(custom_points) || 0 : (diffToPoints[difficulty] || 5);

  try {
    const newTask = new Task({
      user_id: req.user.id,
      title,
      description: description || '',
      category: category || 'personal',
      difficulty: difficulty || 'easy',
      points: basePoints,
      due_date: due_date || null
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, difficulty, due_date, custom_points } = req.body;
  const basePoints = difficulty === 'custom' ? parseInt(custom_points) || 0 : (diffToPoints[difficulty] || 5);

  try {
    let task = await Task.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.title = title || task.title;
    if (description !== undefined) task.description = description;
    task.category = category || task.category;
    task.difficulty = difficulty || task.difficulty;
    task.points = basePoints;
    if (due_date !== undefined) task.due_date = due_date;

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/tasks/:id/complete
// @desc    Mark task as completed or update minutes, award/adjust points
// @access  Private
router.patch('/:id/complete', auth, async (req, res) => {
  const { minutes } = req.body;
  const parsedMinutes = parseInt(minutes) || 1;

  try {
    let task = await Task.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    let pointDifference = 0;
    let isInitialCompletion = false;

    if (task.is_completed) {
      // Adjust points based on new minutes
      const oldPoints = task.points * task.minutes;
      const newPoints = task.points * parsedMinutes;
      pointDifference = newPoints - oldPoints;
    } else {
      // First time completing
      pointDifference = task.points * parsedMinutes;
      task.is_completed = true;
      task.completed_at = new Date();
      isInitialCompletion = true;
    }

    task.minutes = parsedMinutes;
    await task.save();

    // 2. Adjust points for user and update level
    const user = await User.findById(req.user.id);
    let newTotalPoints = user.total_points + pointDifference;
    
    // Calculate daily points
    const today = new Date().toISOString().split('T')[0];
    let todayPointsRecord = await DailyPoint.findOne({ user_id: req.user.id, date: today });
    
    let streakBonus = 0;
    let newStreak = user.current_streak;
    let newBestStreak = user.best_streak;

    if (!todayPointsRecord) {
      // First task of the day!
      // Only award streak bonus on initial completion, not on updates
      if (isInitialCompletion) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const yesterdayRecord = await DailyPoint.findOne({ user_id: req.user.id, date: yesterday });
        
        if (yesterdayRecord) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
        
        if (newStreak > newBestStreak) newBestStreak = newStreak;
        
        if (newStreak > 1) {
            streakBonus = 5; // Streak bonus!
            newTotalPoints += streakBonus;
        }
      }

      todayPointsRecord = new DailyPoint({
        user_id: req.user.id,
        date: today,
        points_earned: pointDifference + streakBonus
      });
      await todayPointsRecord.save();
    } else {
      todayPointsRecord.points_earned += pointDifference;
      await todayPointsRecord.save();
    }

    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    user.total_points = newTotalPoints;
    user.level = newLevel;
    user.current_streak = newStreak;
    user.best_streak = newBestStreak;
    await user.save();

    // Simple Achievements check (First Blood)
    const achievementsCount = await Achievement.countDocuments({ user_id: req.user.id });
    if (achievementsCount === 0) {
        const newAchievement = new Achievement({
          user_id: req.user.id,
          badge_name: 'First Blood',
          badge_icon: '🎯'
        });
        await newAchievement.save();
    }
    
    if (newStreak === 3) {
        const hasOnFire = await Achievement.findOne({ user_id: req.user.id, badge_name: 'On Fire' });
        if(!hasOnFire) {
          const onFireAchievement = new Achievement({
            user_id: req.user.id,
            badge_name: 'On Fire',
            badge_icon: '🔥'
          });
          await onFireAchievement.save();
        }
    }

    // Convert mongoose doc to plain object and add custom field
    const responseTask = task.toObject();
    responseTask.points_awarded = pointDifference + streakBonus;

    res.json({ task: responseTask });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
      if (!task) {
          return res.status(404).json({ msg: 'Task not found or not authorized' });
      }
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
      res.status(500).send('Server Error');
    }
});

module.exports = router;
