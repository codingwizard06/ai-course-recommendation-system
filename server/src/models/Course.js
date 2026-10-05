const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  provider: { type: String, required: true },
  instructor: { type: String, default: 'Staff Instructor' },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'Beginner' },
  durationHours: { type: Number, required: true },
  format: { type: String, enum: ['video', 'interactive', 'project', 'reading'], default: 'video' },
  rating: { type: Number, default: 4.7, min: 1, max: 5 },
  reviewsCount: { type: Number, default: 1200 },
  enrollmentCount: { type: Number, default: 8500 },
  skills: [{ type: String }],
  prerequisites: [{ type: String }],
  url: { type: String, default: 'https://coursera.org' },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800' },
  price: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

CourseSchema.index({ title: 'text', description: 'text', category: 'text', skills: 'text' });

module.exports = mongoose.model('Course', CourseSchema);
