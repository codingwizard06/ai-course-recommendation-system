import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Upload,
  Users,
  BookOpen,
  BarChart2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { courseAPI, userAPI, recommendationAPI } from '../api/client';

export default function AdminPage() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);

  // Course Modal state (Add / Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    provider: '',
    instructor: '',
    category: 'Data Science',
    difficulty: 'Beginner',
    durationHours: 20,
    skills: '',
    url: ''
  });

  // CSV Import state
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState(
`title,description,provider,category,difficulty,durationhours,skills,url
"Intro to Rust Systems Programming","Learn memory safety, ownership, and concurrency in Rust","Rust Foundation","Software Engineering","Beginner",22,"Rust;Systems;Memory Management","https://rust-lang.org"
"GraphQL API Design with Apollo","Build federated schemas and real-time subscriptions with GraphQL and Node","Apollo Academy","Web Development","Intermediate",16,"GraphQL;Node.js;APIs","https://apollographql.com"`
  );

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [cRes, uRes, mRes] = await Promise.all([
        courseAPI.getCourses({ limit: 100 }),
        userAPI.getAllUsers(),
        recommendationAPI.getMetrics()
      ]);

      if (cRes.data) setCourses(cRes.data.courses || []);
      if (uRes.data) setUsers(uRes.data.users || []);
      if (mRes.data) setMetrics(mRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      description: '',
      provider: 'Coursera',
      instructor: 'Staff Instructor',
      category: 'Data Science',
      difficulty: 'Beginner',
      durationHours: 20,
      skills: 'Python, SQL',
      url: 'https://coursera.org'
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      provider: course.provider || '',
      instructor: course.instructor || '',
      category: course.category || 'Data Science',
      difficulty: course.difficulty || 'Beginner',
      durationHours: course.durationHours || 20,
      skills: (course.skills || []).join(', '),
      url: course.url || ''
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...courseForm,
        skills: courseForm.skills.split(',').map(s => s.trim())
      };

      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse._id || editingCourse.id, payload);
      } else {
        await courseAPI.createCourse(payload);
      }
      setIsCourseModalOpen(false);
      fetchAdminData();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course from the catalog?')) return;
    try {
      await courseAPI.deleteCourse(id);
      fetchAdminData();
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleImportCsv = async () => {
    try {
      await courseAPI.importCsv(csvText);
      alert('CSV courses imported successfully!');
      setIsCsvModalOpen(false);
      fetchAdminData();
    } catch (e) {
      alert(e.response?.data?.message || 'Import failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Platform Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Management & ML Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Course catalog authoring, CSV ingestion, user oversight, and ML recommendation evaluation benchmarks.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={handleOpenAddCourse}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'courses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Courses Catalog ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Registered Learners ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('ml_eval')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'ml_eval' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          ML Benchmark Metrics
        </button>
      </div>

      {/* Tab 1: Courses Management */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Title & Provider</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map(course => (
                  <tr key={course._id || course.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 max-w-xs">
                      <p className="line-clamp-1">{course.title}</p>
                      <span className="text-[11px] font-normal text-slate-400">{course.provider}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {course.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold">
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium">{course.durationHours || 20}h</td>
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(course.skills || []).slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditCourse(course)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="Edit course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id || course.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Career Goal</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Tracked Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">
                      <div>{u.name}</div>
                      <span className="text-[11px] font-normal text-slate-400">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-brand-700">{u.careerGoal || 'Not specified'}</td>
                    <td className="p-4">{u.experienceLevel || 'Beginner'}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{(u.currentSkills || []).length} skills</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: ML Offline Evaluation Metrics */}
      {activeTab === 'ml_eval' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  Model Accuracy Benchmark Report (Precision@K, Recall@K, NDCG@K)
                </h3>
                <p className="text-xs text-slate-500">
                  Measurable offline evaluation comparing the AI Hybrid TF-IDF Model against a Popularity Baseline and Random Baseline.
                </p>
              </div>
            </div>

            {metrics && metrics.results ? (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900 text-white font-mono uppercase text-[11px]">
                    <tr>
                      <th className="p-3.5">Evaluation Metric</th>
                      <th className="p-3.5 bg-brand-700 text-white">Hybrid TF-IDF Model (Ours)</th>
                      <th className="p-3.5">Popularity Baseline</th>
                      <th className="p-3.5">Random Baseline</th>
                      <th className="p-3.5 text-right">Relative Lift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {[
                      { key: 'precision@3', label: 'Precision@3' },
                      { key: 'precision@5', label: 'Precision@5' },
                      { key: 'recall@3', label: 'Recall@3' },
                      { key: 'recall@5', label: 'Recall@5' },
                      { key: 'ndcg@3', label: 'NDCG@3 (Ranking Quality)' },
                      { key: 'ndcg@5', label: 'NDCG@5 (Ranking Quality)' },
                      { key: 'mrr', label: 'Mean Reciprocal Rank (MRR)' },
                      { key: 'map', label: 'Mean Average Precision (MAP)' }
                    ].map((row, idx) => {
                      const hVal = metrics.results.hybrid_model?.[row.key] || 0;
                      const pVal = metrics.results.popularity_baseline?.[row.key] || 0;
                      const rVal = metrics.results.random_baseline?.[row.key] || 0;
                      const lift = pVal > 0 ? (((hVal - pVal) / pVal) * 100).toFixed(1) : '+100';

                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-3.5 font-bold font-sans text-slate-800">{row.label}</td>
                          <td className="p-3.5 font-bold text-brand-700 bg-brand-50/50">{hVal.toFixed(4)}</td>
                          <td className="p-3.5 text-slate-600">{pVal.toFixed(4)}</td>
                          <td className="p-3.5 text-slate-400">{rVal.toFixed(4)}</td>
                          <td className="p-3.5 text-right font-bold text-emerald-600">+{lift}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Loading benchmark metrics...</p>
            )}
          </div>
        </div>
      )}

      {/* Course Create/Edit Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingCourse ? 'Edit Course Details' : 'Add New Course to Catalog'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provider</label>
                  <input
                    type="text"
                    required
                    value={courseForm.provider}
                    onChange={(e) => setCourseForm({ ...courseForm, provider: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructor</label>
                  <input
                    type="text"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Data Science">Data Science</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={courseForm.durationHours}
                    onChange={(e) => setCourseForm({ ...courseForm, durationHours: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={courseForm.skills}
                  onChange={(e) => setCourseForm({ ...courseForm, skills: e.target.value })}
                  placeholder="Python, SQL, Machine Learning"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Bulk Ingest Courses via CSV</h3>
              <button onClick={() => setIsCsvModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste standard CSV rows with columns: title, description, provider, category, difficulty, durationhours, skills, url.
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCsv}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Execute Bulk Ingestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
