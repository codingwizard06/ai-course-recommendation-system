const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const mlClient = require('../services/mlClient');
const { requireAuth } = require('../middleware/auth');

// GET /api/recommendations
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const courses = await db.Course.find();
    const feedbackList = await db.Feedback.find({ userId: String(user._id || user.id) });
    const enrollments = await db.Enrollment.find({ userId: String(user._id || user.id) });

    // Exclude completed courses by default
    const excludeIds = enrollments
      .filter(e => e.status === 'completed')
      .map(e => String(e.courseId));

    // Find required skills for target career
    let targetCareerSkills = [];
    if (user.careerGoal) {
      const career = await db.Career.findOne({ title: user.careerGoal });
      if (career) {
        targetCareerSkills = (career.requiredSkills || []).map(s => s.name);
      }
    }

    const { source, recommendations } = await mlClient.getRecommendations({
      profile: user,
      courses,
      feedback: feedbackList,
      targetCareerSkills,
      topK: 10,
      excludeCompletedIds: excludeIds
    });

    res.json({
      status: 'success',
      engineSource: source,
      scoringFormula: "S = 0.40*T(Text) + 0.30*K(Skills) + 0.15*D(Difficulty) + 0.10*P(Preferences) + 0.05*F(Feedback)",
      totalRecommendations: recommendations.length,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/recommendations/feedback
router.post('/feedback', requireAuth, async (req, res) => {
  try {
    const { courseId, action } = req.body;
    const userId = String(req.user._id || req.user.id);

    if (!courseId || !action) {
      return res.status(400).json({ status: 'error', message: 'courseId and action are required' });
    }

    const validActions = ['like', 'dislike', 'save', 'dismiss', 'click'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ status: 'error', message: `action must be one of: ${validActions.join(', ')}` });
    }

    const weightMap = { like: 1.0, dislike: -1.0, save: 0.8, dismiss: -0.6, click: 0.3 };

    await db.Feedback.create({
      userId,
      courseId,
      action,
      weight: weightMap[action] || 0.5,
      createdAt: new Date()
    });

    res.json({
      status: 'success',
      message: `Feedback '${action}' recorded. Recommendation weights adjusted for future suggestions.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/recommendations/metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await mlClient.getModelMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
