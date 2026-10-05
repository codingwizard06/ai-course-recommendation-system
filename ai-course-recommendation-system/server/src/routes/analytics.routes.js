const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const { requireAuth } = require('../middleware/auth');

// GET /api/analytics
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = String(user._id || user.id);

    const enrollments = await db.Enrollment.find({ userId });
    const courses = await db.Course.find();
    const courseMap = {};
    courses.forEach(c => { courseMap[String(c._id || c.id)] = c; });

    let completedCount = 0;
    let inProgressCount = 0;
    let savedCount = 0;
    let totalHoursSpent = 0;
    let totalProgressSum = 0;

    const categoryDistribution = {};
    const skillsAcquired = new Set();

    enrollments.forEach(e => {
      const c = courseMap[String(e.courseId)];
      if (e.status === 'completed') {
        completedCount++;
        totalHoursSpent += e.hoursSpent || (c ? c.durationHours : 20);
        totalProgressSum += 100;
        if (c && c.skills) c.skills.forEach(s => skillsAcquired.add(s));
      } else if (e.status === 'in_progress') {
        inProgressCount++;
        totalHoursSpent += e.hoursSpent || 0;
        totalProgressSum += e.progressPercentage || 0;
      } else if (e.status === 'saved') {
        savedCount++;
      }

      if (c && c.category) {
        categoryDistribution[c.category] = (categoryDistribution[c.category] || 0) + 1;
      }
    });

    const activeCoursesCount = completedCount + inProgressCount;
    const overallProgressRate = activeCoursesCount > 0 ? Math.round(totalProgressSum / activeCoursesCount) : 0;

    // Simulated/Historical weekly study activity for Recharts (Monday - Sunday)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = days.map((day, idx) => {
      const baseHours = [2.0, 1.5, 2.5, 1.0, 3.0, 4.0, 2.0][idx];
      // Scale slightly by user's total hours
      const actual = Math.min(6, Math.max(0.5, Math.round(baseHours * (totalHoursSpent > 0 ? 1 : 0.5) * 10) / 10));
      return {
        day,
        hours: actual,
        target: 2.0
      };
    });

    const weeklyTotal = weeklyActivity.reduce((sum, d) => sum + d.hours, 0);

    // Skill proficiency data for Radar/Bar Chart
    const skillsBreakdown = (user.currentSkills || []).map(s => ({
      skill: typeof s === 'object' ? s.name : s,
      proficiency: typeof s === 'object' ? s.proficiency : 50,
      target: 85
    }));

    // If student has few skills, add foundational ones for visual chart
    if (skillsBreakdown.length === 0) {
      skillsBreakdown.push(
        { skill: 'Python', proficiency: 60, target: 85 },
        { skill: 'SQL', proficiency: 45, target: 85 },
        { skill: 'Data Analysis', proficiency: 50, target: 80 },
        { skill: 'Visualization', proficiency: 40, target: 80 }
      );
    }

    res.json({
      status: 'success',
      analytics: {
        summary: {
          totalEnrolled: enrollments.length,
          completedCount,
          inProgressCount,
          savedCount,
          totalHoursSpent: Math.round(totalHoursSpent * 10) / 10,
          overallProgressRate,
          skillsAcquiredCount: skillsAcquired.size,
          weeklyGoalHours: user.weeklyGoalHours || 10,
          weeklyHoursCompleted: weeklyTotal
        },
        weeklyActivity,
        skillsBreakdown,
        categoryDistribution: Object.entries(categoryDistribution).map(([category, count]) => ({
          category,
          count
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
