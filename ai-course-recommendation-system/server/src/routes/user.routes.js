const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// GET /api/users/profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await db.User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    const { password: _, ...userSafe } = user;
    res.json({ status: 'success', profile: userSafe });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      name,
      educationLevel,
      currentSkills,
      preferredCategories,
      careerGoal,
      experienceLevel,
      preferredDuration,
      preferredFormat,
      weeklyGoalHours
    } = req.body;

    const updated = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(educationLevel !== undefined && { educationLevel }),
          ...(currentSkills !== undefined && { currentSkills }),
          ...(preferredCategories !== undefined && { preferredCategories }),
          ...(careerGoal !== undefined && { careerGoal }),
          ...(experienceLevel !== undefined && { experienceLevel }),
          ...(preferredDuration !== undefined && { preferredDuration }),
          ...(preferredFormat !== undefined && { preferredFormat }),
          ...(weeklyGoalHours !== undefined && { weeklyGoalHours })
        }
      },
      { new: true }
    );

    const { password: _, ...userSafe } = updated;
    res.json({
      status: 'success',
      message: 'Profile updated successfully.',
      profile: userSafe
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/users/all (admin only)
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await db.User.find();
    const safeUsers = users.map(u => {
      const { password: _, ...rest } = u;
      return rest;
    });
    res.json({ status: 'success', users: safeUsers });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
