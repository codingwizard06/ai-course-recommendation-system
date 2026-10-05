const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  requiredSkills: [{
    name: { type: String, required: true },
    importance: { type: String, enum: ['essential', 'important', 'bonus'], default: 'essential' },
    targetProficiency: { type: Number, default: 80 }
  }],
  foundationalSkills: [{ type: String }],
  advancedSkills: [{ type: String }],
  avgSalary: { type: String, default: '$95,000 / yr' },
  jobOutlook: { type: String, default: 'Very High (+23% growth)' },
  recommendedLearningWeeks: { type: Number, default: 24 }
});

module.exports = mongoose.model('Career', CareerSchema);
