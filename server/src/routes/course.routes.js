const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      duration,
      sortBy = 'popularity',
      page = 1,
      limit = 12
    } = req.query;

    let courses = await db.Course.find();

    // 1. Full-text search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      courses = courses.filter(c => {
        const inTitle = (c.title || '').toLowerCase().includes(q);
        const inDesc = (c.description || '').toLowerCase().includes(q);
        const inProvider = (c.provider || '').toLowerCase().includes(q);
        const inInstructor = (c.instructor || '').toLowerCase().includes(q);
        const inSkills = (c.skills || []).some(s => s.toLowerCase().includes(q));
        return inTitle || inDesc || inProvider || inInstructor || inSkills;
      });
    }

    // 2. Filter by Category
    if (category && category !== 'All') {
      courses = courses.filter(c => (c.category || '').toLowerCase() === category.toLowerCase());
    }

    // 3. Filter by Difficulty
    if (difficulty && difficulty !== 'All') {
      courses = courses.filter(c => (c.difficulty || '').toLowerCase() === difficulty.toLowerCase());
    }

    // 4. Filter by Duration
    if (duration && duration !== 'All') {
      if (duration === 'short') courses = courses.filter(c => (c.durationHours || 0) <= 15);
      else if (duration === 'medium') courses = courses.filter(c => (c.durationHours || 0) > 15 && (c.durationHours || 0) <= 35);
      else if (duration === 'long') courses = courses.filter(c => (c.durationHours || 0) > 35);
    }

    // 5. Sorting
    if (sortBy === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popularity') {
      courses.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    } else if (sortBy === 'duration_asc') {
      courses.sort((a, b) => (a.durationHours || 0) - (b.durationHours || 0));
    } else if (sortBy === 'duration_desc') {
      courses.sort((a, b) => (b.durationHours || 0) - (a.durationHours || 0));
    } else if (sortBy === 'price_low') {
      courses.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    const totalCount = courses.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedCourses = courses.slice(startIndex, startIndex + limitNum);

    // Extract available categories for filters
    const allCourses = await db.Course.find();
    const categories = Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)));

    res.json({
      status: 'success',
      totalCount,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      categories,
      courses: paginatedCourses
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }
    res.json({ status: 'success', course });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/courses (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      provider,
      instructor,
      category,
      difficulty,
      durationHours,
      format,
      skills,
      prerequisites,
      url,
      imageUrl,
      price
    } = req.body;

    if (!title || !description || !provider || !category) {
      return res.status(400).json({ status: 'error', message: 'Title, description, provider, and category are required.' });
    }

    const newCourse = await db.Course.create({
      title,
      description,
      provider,
      instructor: instructor || 'Industry Expert',
      category,
      difficulty: difficulty || 'Beginner',
      durationHours: Number(durationHours) || 20,
      format: format || 'video',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      prerequisites: Array.isArray(prerequisites) ? prerequisites : (prerequisites ? prerequisites.split(',').map(s => s.trim()) : []),
      url: url || 'https://coursera.org',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      price: Number(price) || 0,
      rating: 4.8,
      reviewsCount: 1,
      enrollmentCount: 1
    });

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully.',
      course: newCourse
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/courses/:id (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await db.Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }
    res.json({
      status: 'success',
      message: 'Course updated successfully.',
      course: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/courses/:id (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await db.Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }
    res.json({
      status: 'success',
      message: 'Course deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/courses/import-csv (admin CSV bulk import)
router.post('/import-csv', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { csvData } = req.body;
    if (!csvData) {
      return res.status(400).json({ status: 'error', message: 'CSV text data is required' });
    }

    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ status: 'error', message: 'CSV must contain at least headers and 1 row' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const imported = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(v => v.trim());
      if (row.length < headers.length) continue;
      
      const record = {};
      headers.forEach((h, idx) => { record[h] = row[idx]; });

      const courseObj = {
        title: record.title || 'Imported Course',
        description: record.description || 'Imported description',
        provider: record.provider || 'Self-Paced',
        category: record.category || 'General',
        difficulty: record.difficulty || 'Beginner',
        durationHours: Number(record.durationhours) || 20,
        skills: record.skills ? record.skills.split(';').map(s => s.trim()) : [],
        url: record.url || 'https://coursera.org',
        rating: 4.7
      };

      const created = await db.Course.create(courseObj);
      imported.push(created);
    }

    res.json({
      status: 'success',
      message: `Imported ${imported.length} courses successfully.`,
      courses: imported
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
