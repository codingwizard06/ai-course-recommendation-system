const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  educationLevel: { type: String, default: 'Bachelor' },
  currentSkills: [{
    name: { type: String, required: true },
    proficiency: { type: Number, default: 50, min: 0, max: 100 }
  }],
  preferredCategories: [{ type: String }],
  careerGoal: { type: String, default: 'Data Analyst' },
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  preferredDuration: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' },
  preferredFormat: { type: String, enum: ['video', 'interactive', 'project', 'reading'], default: 'video' },
  weeklyGoalHours: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
