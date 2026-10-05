const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const mlClient = require('../services/mlClient');
const { requireAuth } = require('../middleware/auth');

// GET /api/roadmaps
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const userGoal = req.user.careerGoal || 'Data Analyst';

    let roadmap = await db.Roadmap.findOne({ userId });

    // If no roadmap exists yet or career goal changed, generate one
    if (!roadmap || roadmap.careerGoal !== userGoal) {
      const courses = await db.Course.find();
      const { roadmap: generated } = await mlClient.getRoadmap({
        careerGoal: userGoal,
        profile: req.user,
        courses
      });

      if (roadmap) {
        roadmap = await db.Roadmap.findByIdAndUpdate(roadmap._id || roadmap.id, {
          careerGoal: userGoal,
          stages: generated.stages
        }, { new: true });
      } else {
        roadmap = await db.Roadmap.create({
          userId,
          careerGoal: userGoal,
          stages: generated.stages
        });
      }
    }

    res.json({ status: 'success', roadmap });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/roadmaps (regenerate roadmap)
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const { careerGoal } = req.body;
    const targetGoal = careerGoal || req.user.careerGoal || 'Data Analyst';

    const courses = await db.Course.find();
    const { roadmap: generated } = await mlClient.getRoadmap({
      careerGoal: targetGoal,
      profile: { ...req.user, careerGoal: targetGoal },
      courses
    });

    const updated = await db.Roadmap.findOneAndUpdate(
      { userId },
      { careerGoal: targetGoal, stages: generated.stages },
      { upsert: true, new: true }
    );

    res.json({
      status: 'success',
      message: 'Personalized career roadmap generated.',
      roadmap: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/roadmaps/step/:stepNumber
router.patch('/step/:stepNumber', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const stepNum = parseInt(req.params.stepNumber, 10);
    const { status, isCompleted } = req.body;

    const roadmap = await db.Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ status: 'error', message: 'Roadmap not found' });
    }

    let found = false;
    for (const stage of roadmap.stages) {
      for (const step of stage.steps) {
        if (step.stepNumber === stepNum) {
          if (status) step.status = status;
          if (isCompleted !== undefined) step.isCompleted = Boolean(isCompleted);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return res.status(404).json({ status: 'error', message: `Step #${stepNum} not found in roadmap` });
    }

    await db.Roadmap.findByIdAndUpdate(roadmap._id || roadmap.id, { stages: roadmap.stages });

    res.json({
      status: 'success',
      message: `Step #${stepNum} progress updated.`,
      roadmap
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
