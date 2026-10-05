const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/datastore');
const { generateToken, requireAuth } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, educationLevel, careerGoal, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and password are required.' });
    }

    const existingUser = await db.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      educationLevel: educationLevel || "Bachelor's Degree",
      careerGoal: careerGoal || 'Data Analyst',
      experienceLevel: experienceLevel || 'Beginner',
      currentSkills: [],
      preferredCategories: [],
      preferredDuration: 'medium',
      preferredFormat: 'video',
      weeklyGoalHours: 10
    });

    const token = generateToken(user);

    // omit password in response
    const { password: _, ...userSafe } = user;

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      token,
      user: userSafe
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    const user = await db.User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    res.json({
      status: 'success',
      message: 'Logged in successfully.',
      token,
      user: userSafe
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { password: _, ...userSafe } = req.user;
  res.json({
    status: 'success',
    user: userSafe
  });
});

// POST /api/auth/forgot-password (mock flow for user convenience)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await db.User.findOne({ email: (email || '').toLowerCase() });
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'Email not found.' });
  }
  res.json({
    status: 'success',
    message: 'Password reset link sent to your registered email address (simulated).'
  });
});

module.exports = router;
