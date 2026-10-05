import React, { useState } from 'react';
import { X, Star, Clock, BookOpen, ExternalLink, Check, Bookmark, PlayCircle, Award, Sparkles } from 'lucide-react';
import { enrollmentAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CourseModal({ course, onClose, onEnrolled }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [enrolledStatus, setEnrolledStatus] = useState(null);
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!course) return null;

  const handleEnroll = async (status = 'in_progress') => {
    if (!user) return alert('Please sign in to enroll in courses.');
    setLoading(true);
    try {
      await enrollmentAPI.enroll(course._id || course.id, status, targetDate || undefined, notes || undefined);
      setEnrolledStatus(status);
      if (onEnrolled) onEnrolled(course, status);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update enrollment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner with image */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
          <img
            src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500 text-white">
                {course.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                {course.difficulty}
              </span>
              {course.matchScore && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  {course.matchScore}% AI Match
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{course.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{course.provider} • By {course.instructor}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-xs text-slate-500 font-medium">Rating</span>
              <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {course.rating || 4.8}★
                <span className="text-xs font-normal text-slate-400">({(course.reviewsCount || 1200).toLocaleString()})</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Estimated Duration</span>
              <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {course.durationHours || 20} Hours
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Format</span>
              <div className="text-sm font-bold text-slate-800 capitalize flex items-center justify-center gap-1 mt-0.5">
                <PlayCircle className="w-4 h-4 text-slate-500" />
                {course.format || 'Video'}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Price</span>
              <div className="text-sm font-bold text-emerald-600 mt-0.5">
                {course.price > 0 ? `$${course.price}` : 'Free Access'}
              </div>
            </div>
          </div>

          {/* AI Recommendation Reason */}
          {course.recommendationReason && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Why We Recommend This Course For You
              </h4>
              <p className="text-sm text-brand-900 leading-relaxed">
                {course.recommendationReason}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">About This Course</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Skills Covered */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" />
              Skills You Will Gain
            </h4>
            <div className="flex flex-wrap gap-2">
              {(course.skills || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" />
              Prerequisites & Requirements
            </h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {(course.prerequisites && course.prerequisites.length > 0) ? (
                course.prerequisites.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    {p}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No formal prerequisites required. Beginner friendly.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <a
            href={course.url || 'https://coursera.org'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            Open on {course.provider}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEnroll('saved')}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save to Wishlist
            </button>
            <button
              onClick={() => handleEnroll('in_progress')}
              disabled={loading || enrolledStatus === 'in_progress'}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              {enrolledStatus === 'in_progress' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Enrolled & In Progress
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  Start Learning (Enroll)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
