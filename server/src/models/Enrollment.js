const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  status: { type: String, enum: ['saved', 'in_progress', 'completed'], default: 'saved' },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  hoursSpent: { type: Number, default: 0 },
  targetDate: { type: Date },
  completedAt: { type: Date },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
