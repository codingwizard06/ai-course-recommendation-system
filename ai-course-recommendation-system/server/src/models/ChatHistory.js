const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    courseSuggestions: [{
      id: { type: String },
      title: { type: String },
      difficulty: { type: String },
      provider: { type: String },
      rating: { type: Number }
    }],
    timestamp: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
