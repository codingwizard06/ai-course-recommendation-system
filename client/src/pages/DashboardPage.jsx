import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Map,
  Target,
  ArrowRight,
  Bot,
  CheckCircle,
  Play,
  RotateCw,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { recommendationAPI, analyticsAPI, enrollmentAPI, roadmapAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [breakdownCourse, setBreakdownCourse] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [recRes, anaRes, enrRes, rmpRes] = await Promise.all([
        recommendationAPI.getRecommendations(),
        analyticsAPI.getAnalytics(),
        enrollmentAPI.getEnrollments(),
        roadmapAPI.getRoadmap()
      ]);

      if (recRes.data) setRecommendations(recRes.data.recommendations || []);
      if (anaRes.data) setAnalytics(anaRes.data.analytics || null);
      if (enrRes.data) setEnrollments(enrRes.data.enrollments || []);
      if (rmpRes.data) setRoadmap(rmpRes.data.roadmap || null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const inProgressList = enrollments.filter(e => e.status === 'in_progress');
  const savedList = enrollments.filter(e => e.status === 'saved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 border border-brand-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Target Career: {user?.careerGoal || 'Data Analyst'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your AI recommendation model has updated based on your current skill proficiency and recent learning activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4" />
              Ask AI Mentor
            </button>
            <button
              onClick={() => onNavigate('skillgap')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/10 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Skill-Gap Analysis
            </button>
            <button
              onClick={fetchDashboardData}
              title="Refresh recommendations"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Courses Enrolled</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {analytics?.summary?.totalEnrolled || enrollments.length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed Courses</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {analytics?.summary?.completedCount || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Learning Hours</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {analytics?.summary?.totalHoursSpent || 0}h
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {analytics?.summary?.overallProgressRate || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Recommended Courses */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Personalized AI Course Recommendations</h2>
              <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                Top Matches
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked with hybrid TF-IDF + cosine similarity, skill matching, and difficulty fit.
            </p>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
          >
            View All AI Matches
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((course, idx) => (
              <CourseCard
                key={course._id || course.id || idx}
                course={course}
                onOpenDetails={setSelectedCourse}
                onOpenScoreBreakdown={setBreakdownCourse}
                onFeedbackGiven={() => {}}
                isRecommended={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <p className="text-sm">No courses recommended yet. Try updating your profile skills.</p>
          </div>
        )}
      </div>

      {/* Charts Grid: Weekly Activity (BarChart) + Skill Competency (RadarChart / Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity BarChart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                Weekly Learning Hours Activity
              </h3>
              <p className="text-xs text-slate-500">Study hours logged over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Goal: {analytics?.summary?.weeklyGoalHours || 10}h / week
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.weeklyActivity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip
                  formatter={(val) => [`${val} hours`, 'Study Time']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#0c8fe9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Progress Radar/List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Skill Proficiencies
              </h3>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                Edit Skills
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Competency benchmark coverage</p>
          </div>

          <div className="space-y-3.5 my-auto py-2">
            {(analytics?.skillsBreakdown || [
              { skill: 'Python', proficiency: 60, target: 85 },
              { skill: 'SQL', proficiency: 35, target: 85 },
              { skill: 'Excel', proficiency: 75, target: 85 },
              { skill: 'Power BI', proficiency: 20, target: 75 }
            ]).slice(0, 4).map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.skill}</span>
                  <span className="font-mono text-slate-500">{s.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      s.proficiency >= 70 ? 'bg-emerald-500' : s.proficiency >= 40 ? 'bg-brand-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('skillgap')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            Launch Full Skill-Gap Analysis
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Section: In Progress Courses + Roadmap Step Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In Progress Learning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-brand-600" />
              In Progress Courses ({inProgressList.length})
            </h3>
            <button
              onClick={() => onNavigate('mylearning')}
              className="text-xs text-brand-600 font-semibold hover:underline"
            >
              Manage Learning
            </button>
          </div>

          {inProgressList.length > 0 ? (
            <div className="space-y-3">
              {inProgressList.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCourse(item.course)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/20 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.course?.title}</h4>
                    <span className="text-[11px] font-mono font-bold text-brand-600">{item.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full" style={{ width: `${item.progressPercentage}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{item.hoursSpent || 0} hrs logged</span>
                    <span className="text-brand-600 font-medium">Continue Learning →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
              No active courses in progress. Browse the catalog to start one!
            </div>
          )}
        </div>

        {/* Roadmap Next Step Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Map className="w-4 h-4 text-indigo-600" />
              Next Milestone in Career Roadmap
            </h3>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Full Roadmap
            </button>
          </div>

          {roadmap && roadmap.stages && roadmap.stages.length > 0 ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                  {roadmap.stages[0]?.stageTitle}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {roadmap.stages[0]?.steps?.[0]?.title || 'Foundational Step'}
                </h4>
                <p className="text-xs text-slate-600">
                  Estimated completion: ~{roadmap.stages[0]?.steps?.[0]?.estimatedWeeks || 2} weeks. Focus on core syntax and hands-on drills.
                </p>
              </div>

              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                Open Full Roadmap Graph
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
              Roadmap generating... Click Full Roadmap to configure.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnrolled={() => fetchDashboardData()}
        />
      )}

      {breakdownCourse && (
        <ScoreBreakdownModal
          course={breakdownCourse}
          onClose={() => setBreakdownCourse(null)}
        />
      )}
    </div>
  );
}
