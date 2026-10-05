const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  careerGoal: { type: String, required: true },
  stages: [{
    stageTitle: { type: String, required: true },
    stageDurationWeeks: { type: Number, default: 4 },
    steps: [{
      stepNumber: { type: Number, required: true },
      courseId: { type: String },
      title: { type: String, required: true },
      provider: { type: String },
      difficulty: { type: String },
      durationHours: { type: Number },
      skills: [{ type: String }],
      prerequisites: [{ type: String }],
      isCompleted: { type: Boolean, default: false },
      status: { type: String, enum: ['locked', 'in_progress', 'completed'], default: 'locked' },
      estimatedWeeks: { type: Number, default: 2 }
    }]
  }],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
