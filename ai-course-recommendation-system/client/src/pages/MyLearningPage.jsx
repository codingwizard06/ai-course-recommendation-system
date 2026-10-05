import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Bookmark, Play, Plus, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';
import { enrollmentAPI } from '../api/client';
import CourseModal from '../components/CourseModal';

export default function MyLearningPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('in_progress');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await enrollmentAPI.getEnrollments();
      if (res.data) setEnrollments(res.data.enrollments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateProgress = async (id, progressPercentage) => {
    try {
      await enrollmentAPI.updateProgress(id, { progressPercentage });
      fetchEnrollments();
    } catch (e) {
      alert('Failed to update progress');
    }
  };

  const handleLogHours = async (id, currentHours, addHours) => {
    try {
      await enrollmentAPI.updateProgress(id, { hoursSpent: (currentHours || 0) + addHours });
      fetchEnrollments();
    } catch (e) {
      alert('Failed to log study hours');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this course from your learning list?')) return;
    try {
      await enrollmentAPI.removeEnrollment(id);
      fetchEnrollments();
    } catch (e) {
      alert('Failed to remove course');
    }
  };

  const filtered = enrollments.filter(e => e.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600" />
            My Learning & Course Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track study hours, update module milestones, and review completed credentials.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'in_progress' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({enrollments.filter(e => e.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({enrollments.filter(e => e.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'saved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wishlist ({enrollments.filter(e => e.status === 'saved').length})
          </button>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-brand-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Course details */}
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    {item.course?.category || 'General'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-50 text-brand-700">
                    {item.course?.difficulty || 'Beginner'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.course?.provider}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedCourse(item.course)}
                  className="font-bold text-base text-slate-900 hover:text-brand-600 cursor-pointer transition-colors"
                >
                  {item.course?.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {item.course?.description}
                </p>

                {/* Progress bar (if in_progress) */}
                {activeTab === 'in_progress' && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Course Completion</span>
                      <span className="font-mono text-brand-600">{item.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${item.progressPercentage}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress manipulation controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {activeTab === 'in_progress' && (
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Log +1h button */}
                    <button
                      onClick={() => handleLogHours(item._id || item.id, item.hoursSpent, 1)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      +1 hr ({item.hoursSpent || 0}h)
                    </button>

                    {/* Progress slider shortcut */}
                    <select
                      value={item.progressPercentage}
                      onChange={(e) => handleUpdateProgress(item._id || item.id, Number(e.target.value))}
                      className="py-1.5 px-2 border border-slate-300 rounded-xl bg-white text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value={10}>10% done</option>
                      <option value={25}>25% done</option>
                      <option value={50}>50% done</option>
                      <option value={75}>75% done</option>
                      <option value={100}>100% (Complete)</option>
                    </select>
                  </div>
                )}

                {activeTab === 'completed' && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Award className="w-4 h-4" />
                    Verified Completion ({item.hoursSpent || item.course?.durationHours || 20}h)
                  </div>
                )}

                {activeTab === 'saved' && (
                  <button
                    onClick={() => handleUpdateProgress(item._id || item.id, 0)}
                    className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Start Course Now
                  </button>
                )}

                <button
                  onClick={() => handleRemove(item._id || item.id)}
                  title="Remove from my learning"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No courses in this section yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Discover courses in the catalog or recommendations and click "Enroll" or "Save to Wishlist".
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnrolled={fetchEnrollments}
        />
      )}
    </div>
  );
}
