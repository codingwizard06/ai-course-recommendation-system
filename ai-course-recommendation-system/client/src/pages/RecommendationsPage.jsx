import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCw, Info, Cpu, CheckCircle, Sliders } from 'lucide-react';
import { recommendationAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import ScoreBreakdownModal from '../components/ScoreBreakdownModal';

export default function RecommendationsPage({ onNavigate }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engineSource, setEngineSource] = useState('hybrid-engine');
  const [formulaString, setFormulaString] = useState('');

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [breakdownCourse, setBreakdownCourse] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationAPI.getRecommendations();
      if (res.data) {
        setRecommendations(res.data.recommendations || []);
        setEngineSource(res.data.engineSource || 'hybrid-engine');
        setFormulaString(res.data.scoringFormula || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            Engine: {engineSource === 'python-ml-microservice' ? 'Python Microservice (Port 5001)' : 'Integrated Hybrid Model'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-brand-600" />
            Top 10 Personalized AI Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Every course below is specifically ranked using TF-IDF text relevance, skill coverage, difficulty fit,
            duration preference, and your past feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            Tune Preferences
          </button>
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Recalculate Scores
          </button>
        </div>
      </div>

      {/* Math Formula Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Scoring Architecture</span>
          <div className="font-mono text-xs sm:text-sm text-slate-200">
            {formulaString || "S = 0.40*T(Text) + 0.30*K(Skills) + 0.15*D(Difficulty) + 0.10*P(Preferences) + 0.05*F(Feedback)"}
          </div>
        </div>
        <div className="text-xs text-slate-400 max-w-xs sm:text-right">
          Click <span className="text-brand-300 font-semibold">"Score Math"</span> on any card to view its exact vector breakdown.
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(course => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              onOpenDetails={setSelectedCourse}
              onOpenScoreBreakdown={setBreakdownCourse}
              isRecommended={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No recommendations generated yet. Try setting your career goal in your profile.</p>
        </div>
      )}

      {/* Modals */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnrolled={() => fetchRecommendations()}
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
