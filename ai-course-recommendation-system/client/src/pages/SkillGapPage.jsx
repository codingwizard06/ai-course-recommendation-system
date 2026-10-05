import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, BookOpen, Sparkles, Briefcase } from 'lucide-react';
import { skillAPI, careerAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CourseModal from '../components/CourseModal';

export default function SkillGapPage({ onNavigate }) {
  const { user } = useAuth();
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(user?.careerGoal || 'Data Analyst');
  const [gapData, setGapData] = useState(null);
  const [careerInfo, setCareerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await careerAPI.getCareers();
        if (res.data) setCareers(res.data.careers || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCareers();
  }, []);

  const fetchGapAnalysis = async (careerTitle) => {
    setLoading(true);
    try {
      const res = await skillAPI.getSkillGap(careerTitle);
      if (res.data) {
        setGapData(res.data.gapAnalysis);
        setCareerInfo(res.data.career);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGapAnalysis(selectedCareer);
  }, [selectedCareer]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Career Selector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" />
              Role Benchmark Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Career Skill-Gap Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Compare your current competencies against live industry requirements to identify exact learning priorities.
            </p>
          </div>

          {/* Career Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Target Role:</span>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="py-2 px-3.5 text-xs font-bold border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none shadow-xs"
            >
              {careers.map((c, idx) => (
                <option key={idx} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Career Benchmark Highlights Card */}
        {careerInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium">Market Compensation</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{careerInfo.avgSalary || '$95,000 / yr'}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium">Industry Demand</span>
              <div className="text-base font-extrabold text-emerald-600 mt-0.5">{careerInfo.jobOutlook || 'Very High (+25%)'}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium">Readiness Level</span>
              <div className="text-base font-extrabold text-brand-600 mt-0.5">{gapData?.readinessStatus || 'Foundational'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Readiness Gauge */}
      {gapData && (
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Overall Profile Match</span>
            <h2 className="text-3xl sm:text-4xl font-black">
              {gapData.overallMatchPercentage}% Competency Match
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have mastered <strong className="text-white">{gapData.masteredSkillsCount}</strong> out of{' '}
              <strong className="text-white">{gapData.totalRequiredSkills}</strong> essential skills for{' '}
              <strong className="text-white">{selectedCareer}</strong>.
            </p>
          </div>

          {/* Mini progress bar cluster */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-emerald-400">{gapData.masteredSkillsCount}</span>
              <span className="text-[11px] text-slate-300 block font-medium mt-0.5">Mastered (80%+)</span>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-amber-400">{gapData.inProgressSkillsCount}</span>
              <span className="text-[11px] text-slate-300 block font-medium mt-0.5">In Progress</span>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-rose-400">{gapData.missingSkillsCount}</span>
              <span className="text-[11px] text-slate-300 block font-medium mt-0.5">Missing</span>
            </div>
          </div>
        </div>
      )}

      {/* Skill Breakdown Categories */}
      {loading ? (
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      ) : gapData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Missing Skills (Highest Priority) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm">Critical Skill Gaps ({gapData.missingSkills.length})</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">Urgent</span>
            </div>
            <p className="text-xs text-slate-500">Skills required for this career that you haven't started yet.</p>

            <div className="space-y-3 pt-2">
              {gapData.missingSkills.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">{s.name}</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                      0% (Need 80%+)
                    </span>
                  </div>

                  {s.recommendedCourses && s.recommendedCourses.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Course:</span>
                      <button
                        onClick={() => setSelectedCourse(s.recommendedCourses[0])}
                        className="text-left text-xs font-semibold text-brand-600 hover:underline line-clamp-1 block"
                      >
                        {s.recommendedCourses[0].title} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. In Progress Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">In Progress ({gapData.inProgressSkills.length})</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Advancing</span>
            </div>
            <p className="text-xs text-slate-500">Partially developed competencies needing reinforcement.</p>

            <div className="space-y-3 pt-2">
              {gapData.inProgressSkills.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="font-mono font-bold text-amber-700">{s.currentProficiency}%</span>
                  </div>
                  <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.currentProficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Mastered Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 text-sm">Mastered Competencies ({gapData.masteredSkills.length})</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Verified</span>
            </div>
            <p className="text-xs text-slate-500">Skills meeting or exceeding the 80% industry readiness bar.</p>

            <div className="space-y-3 pt-2">
              {gapData.masteredSkills.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{s.name}</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{s.currentProficiency}% ★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
