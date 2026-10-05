import React, { useState } from 'react';
import { Star, Clock, ThumbsUp, ThumbsDown, Bookmark, EyeOff, Info, Sparkles, ChevronRight, Play } from 'lucide-react';
import { recommendationAPI, enrollmentAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CourseCard({
  course,
  onOpenDetails,
  onOpenScoreBreakdown,
  onFeedbackGiven,
  isRecommended = false
}) {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFeedback = async (action, e) => {
    e.stopPropagation();
    if (!user) return alert('Please sign in to rate recommendations');
    try {
      setFeedback(action);
      if (action === 'save') setSaved(true);
      if (action === 'dismiss') setDismissed(true);
      await recommendationAPI.sendFeedback(course._id || course.id, action);
      if (onFeedbackGiven) onFeedbackGiven(course, action);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickEnroll = async (e) => {
    e.stopPropagation();
    if (!user) return alert('Please sign in to enroll');
    try {
      await enrollmentAPI.enroll(course._id || course.id, 'in_progress');
      alert(`Enrolled in "${course.title}". Added to My Learning!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (dismissed) {
    return (
      <div className="bg-slate-100 rounded-2xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center text-slate-500 animate-in fade-in">
        <EyeOff className="w-6 h-6 mb-2 text-slate-400" />
        <p className="text-xs font-medium">Recommendation dismissed.</p>
        <button
          onClick={() => setDismissed(false)}
          className="text-xs text-brand-600 font-semibold hover:underline mt-2"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(course)}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <img
          src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Category & Difficulty Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {course.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
            {course.difficulty}
          </span>
        </div>

        {/* AI Match Badge */}
        {course.matchScore !== undefined && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {course.matchScore}% Match
            </span>
          </div>
        )}

        {/* Provider */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <p className="text-xs font-medium text-slate-300 line-clamp-1">{course.provider}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* AI Explanation Pill */}
          {course.recommendationReason && (
            <div className="mt-2.5 p-2 rounded-lg bg-brand-50 border border-brand-100 flex items-start gap-1.5 text-xs text-brand-900">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 italic">{course.recommendationReason}</span>
            </div>
          )}
        </div>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(course.skills || []).slice(0, 3).map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
              {s}
            </span>
          ))}
          {(course.skills || []).length > 3 && (
            <span className="text-xs text-slate-400 self-center">
              +{(course.skills.length - 3)} more
            </span>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {course.rating || 4.7}★
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.durationHours || 20}h
            </span>
          </div>

          <span className="font-bold text-slate-800">
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </span>
        </div>

        {/* Action Controls & Interactive Feedback */}
        <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-100/80">
          {/* Feedback Icons */}
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              title="Like recommendation"
              onClick={(e) => handleFeedback('like', e)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${feedback === 'like' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'}`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              title="Dislike recommendation"
              onClick={(e) => handleFeedback('dislike', e)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${feedback === 'dislike' ? 'bg-rose-100 text-rose-700' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'}`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
            <button
              title="Save to wishlist"
              onClick={(e) => handleFeedback('save', e)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${saved ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'}`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button
              title="Dismiss course"
              onClick={(e) => handleFeedback('dismiss', e)}
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inspect Score button if recommendation info exists */}
          <div className="flex items-center gap-1.5">
            {course.scoreDetails && onOpenScoreBreakdown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenScoreBreakdown(course);
                }}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors flex items-center gap-1"
                title="View mathematical scoring breakdown"
              >
                <Info className="w-3 h-3" />
                Score Math
              </button>
            )}

            <button
              onClick={handleQuickEnroll}
              className="px-3 py-1 bg-slate-900 text-white hover:bg-brand-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
