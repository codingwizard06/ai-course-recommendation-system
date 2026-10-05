import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Sparkles, BookOpen, Star, User, Clock, ArrowRight } from 'lucide-react';
import { assistantAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CourseModal from '../components/CourseModal';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const messagesEndRef = useRef(null);

  const starterChips = [
    "What should I learn next to become a Data Analyst?",
    "Explain prerequisites for Deep Learning with PyTorch",
    "Create a 10-hour weekly study schedule for me",
    "Compare Python vs JavaScript for web development"
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await assistantAPI.getHistory();
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          // Default initial friendly greeting
          setMessages([
            {
              role: 'assistant',
              content: `Hello ${user?.name || 'there'}! I am your AI Learning Advisor.\n\nI have full access to our curated course catalog and your learning profile (${user?.careerGoal || 'Technology'}). How can I assist your study plans today?`,
              courseSuggestions: []
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await assistantAPI.sendMessage(text);
      if (res.data && res.data.reply) {
        setMessages(prev => [...prev, res.data.reply]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue generating an answer. Please verify the backend connection.',
          courseSuggestions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear your conversation history?')) return;
    try {
      await assistantAPI.clearHistory();
      setMessages([
        {
          role: 'assistant',
          content: `History cleared. What would you like to explore next, ${user?.name}?`,
          courseSuggestions: []
        }
      ]);
    } catch (e) {
      alert('Failed to clear history');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">AI Learning Assistant & Mentor</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Active & Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in the course catalog and your learning profile ({user?.careerGoal || 'Data Analyst'}).
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          title="Clear chat history"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {starterChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-700 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 whitespace-nowrap transition-colors shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 h-[550px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-brand-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Course Suggestions Cards attached to Assistant message */}
                {msg.courseSuggestions && msg.courseSuggestions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Attached Catalog Courses:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.courseSuggestions.map((course, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => setSelectedCourse({ ...course, _id: course.id })}
                          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/20 cursor-pointer transition-all shadow-xs space-y-1"
                        >
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-brand-600">{course.provider}</span>
                            <span className="font-bold text-slate-700">★ {course.rating || 4.8}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{course.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium block">Difficulty: {course.difficulty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-brand-500 animate-bounce" />
            <span>AI Advisor is analyzing curriculum & profile...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="relative bg-white rounded-2xl border border-slate-300 shadow-md p-2 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about courses, prerequisites, or learning plans..."
          disabled={loading}
          className="w-full px-4 py-2 text-xs sm:text-sm text-slate-900 outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
