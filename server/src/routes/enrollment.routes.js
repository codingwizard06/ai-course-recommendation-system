const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const { requireAuth } = require('../middleware/auth');

// GET /api/enrollments
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const enrollments = await db.Enrollment.find({ userId });
    const courses = await db.Course.find();
    const courseMap = {};
    courses.forEach(c => { courseMap[String(c._id || c.id)] = c; });

    const enriched = enrollments.map(e => ({
      ...e,
      course: courseMap[String(e.courseId)] || { title: 'Unknown Course', category: 'General' }
    }));

    res.json({ status: 'success', enrollments: enriched });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/enrollments
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const { courseId, status = 'in_progress', targetDate, notes } = req.body;

    if (!courseId) {
      return res.status(400).json({ status: 'error', message: 'courseId is required' });
    }

    const course = await db.Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }

    let existing = await db.Enrollment.findOne({ userId, courseId: String(courseId) });
    if (existing) {
      existing = await db.Enrollment.findByIdAndUpdate(
        existing._id || existing.id,
        {
          status,
          ...(targetDate && { targetDate: new Date(targetDate) }),
          ...(notes && { notes })
        },
        { new: true }
      );
      return res.json({
        status: 'success',
        message: `Course status updated to '${status}'.`,
        enrollment: existing
      });
    }

    const newEnrollment = await db.Enrollment.create({
      userId,
      courseId: String(courseId),
      status,
      progressPercentage: status === 'completed' ? 100 : 0,
      hoursSpent: 0,
      targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: notes || ''
    });

    res.status(201).json({
      status: 'success',
      message: `Enrolled in '${course.title}'.`,
      enrollment: newEnrollment
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/enrollments/:id
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progressPercentage, hoursSpent, status, rating, notes, targetDate } = req.body;

    const existing = await db.Enrollment.findById(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Enrollment record not found' });
    }

    const updatePayload = {
      ...(progressPercentage !== undefined && { progressPercentage: Math.min(100, Math.max(0, Number(progressPercentage))) }),
      ...(hoursSpent !== undefined && { hoursSpent: Number(hoursSpent) }),
      ...(status && { status }),
      ...(rating !== undefined && { rating: Number(rating) }),
      ...(notes !== undefined && { notes }),
      ...(targetDate && { targetDate: new Date(targetDate) })
    };

    if (progressPercentage === 100 && existing.status !== 'completed') {
      updatePayload.status = 'completed';
      updatePayload.completedAt = new Date();
    }

    const updated = await db.Enrollment.findByIdAndUpdate(id, updatePayload, { new: true });

    res.json({
      status: 'success',
      message: 'Progress recorded.',
      enrollment: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/enrollments/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Enrollment record not found' });
    }
    res.json({ status: 'success', message: 'Course removed from your learning list.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
