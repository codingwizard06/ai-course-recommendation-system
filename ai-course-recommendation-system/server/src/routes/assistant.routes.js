const express = require('express');
const router = express.Router();
const db = require('../db/datastore');
const assistantService = require('../services/assistantService');
const { requireAuth } = require('../middleware/auth');

// POST /api/assistant/chat
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = String(req.user._id || req.user.id);

    if (!message || !message.trim()) {
      return res.status(400).json({ status: 'error', message: 'Message content is required.' });
    }

    let chat = await db.ChatHistory.findOne({ userId });
    const history = chat ? chat.messages : [];

    const reply = await assistantService.processMessage(req.user, message, history);

    const userMsg = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    const assistantMsg = {
      role: 'assistant',
      content: reply.content,
      courseSuggestions: reply.courseSuggestions || [],
      timestamp: new Date()
    };

    if (chat) {
      chat.messages.push(userMsg, assistantMsg);
      await db.ChatHistory.findByIdAndUpdate(chat._id || chat.id, { messages: chat.messages });
    } else {
      chat = await db.ChatHistory.create({
        userId,
        messages: [userMsg, assistantMsg]
      });
    }

    res.json({
      status: 'success',
      reply: assistantMsg
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/assistant/history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const chat = await db.ChatHistory.findOne({ userId });
    res.json({
      status: 'success',
      messages: chat ? chat.messages : []
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/assistant/history
router.delete('/history', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    await db.ChatHistory.findOneAndUpdate({ userId }, { messages: [] });
    res.json({ status: 'success', message: 'Chat history cleared.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
