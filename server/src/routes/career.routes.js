const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// GET /api/careers
router.get('/', async (req, res) => {
  try {
    const careers = await db.Career.find();
    res.json({ status: 'success', careers });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/careers/:title
router.get('/:title', async (req, res) => {
  try {
    const career = await db.Career.findOne({ title: req.params.title });
    if (!career) {
      return res.status(404).json({ status: 'error', message: 'Career benchmark not found' });
    }
    res.json({ status: 'success', career });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/careers (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const newCareer = await db.Career.create(req.body);
    res.status(201).json({ status: 'success', career: newCareer });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/careers/:id (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await db.Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', career: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
