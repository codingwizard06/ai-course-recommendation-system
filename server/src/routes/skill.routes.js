const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const mlClient = require('../services/mlClient');
const { requireAuth } = require('../middleware/auth');

// GET /api/skills/gap
router.get('/gap', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const targetCareer = req.query.careerTitle || user.careerGoal || 'Data Analyst';

    const career = await db.Career.findOne({ title: targetCareer });
    if (!career) {
      return res.status(404).json({
        status: 'error',
        message: `Career '${targetCareer}' not found in industry benchmarks.`
      });
    }

    const courses = await db.Course.find();

    const { source, data } = await mlClient.getSkillGap({
      userSkills: user.currentSkills || [],
      careerTitle: career.title,
      requiredSkills: career.requiredSkills || [],
      courses
    });

    res.json({
      status: 'success',
      engineSource: source,
      career: {
        title: career.title,
        description: career.description,
        avgSalary: career.avgSalary,
        jobOutlook: career.jobOutlook
      },
      gapAnalysis: data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/skills/gap (custom input calculation)
router.post('/gap', async (req, res) => {
  try {
    const { userSkills, careerTitle } = req.body;
    const targetCareer = careerTitle || 'Data Analyst';

    const career = await db.Career.findOne({ title: targetCareer });
    const courses = await db.Course.find();

    const requiredSkills = career ? career.requiredSkills : [
      { name: 'Python', importance: 'essential' },
      { name: 'SQL', importance: 'essential' },
      { name: 'Excel', importance: 'essential' }
    ];

    const { source, data } = await mlClient.getSkillGap({
      userSkills: userSkills || [],
      careerTitle: targetCareer,
      requiredSkills,
      courses
    });

    res.json({
      status: 'success',
      engineSource: source,
      gapAnalysis: data
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
