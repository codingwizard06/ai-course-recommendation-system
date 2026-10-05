import React from 'react';
import { X, Cpu, Info, CheckCircle2, Sparkles } from 'lucide-react';

export default function ScoreBreakdownModal({ course, onClose }) {
  if (!course) return null;
  const details = course.scoreDetails || {};
  const weights = details.weights || { text: 0.40, skills: 0.30, difficulty: 0.15, preferences: 0.10, feedback: 0.05 };

  const components = [
    {
      label: 'T — Content Textual Similarity',
      desc: 'Cosine similarity between your profile (interests, target career) and course descriptions via TF-IDF vectorization.',
      raw: details.textSimilarity || 0,
      weight: weights.text,
      weighted: (details.textSimilarity || 0) * weights.text,
      color: 'bg-blue-600',
      textColor: 'text-blue-700'
    },
    {
      label: 'K — Skill Gap & Coverage Match',
      desc: 'Overlap between skills taught by this course and your missing target career skills or current competencies.',
      raw: details.skillMatch || 0,
      weight: weights.skills,
      weighted: (details.skillMatch || 0) * weights.skills,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700'
    },
    {
      label: 'D — Difficulty Appropriateness',
      desc: 'Compatibility between your current experience level and this course difficulty rating.',
      raw: details.difficultySuitability || 0,
      weight: weights.difficulty,
      weighted: (details.difficultySuitability || 0) * weights.difficulty,
      color: 'bg-amber-600',
      textColor: 'text-amber-700'
    },
    {
      label: 'P — Format & Duration Preference',
      desc: 'Alignment with your preferred study duration pace (short/medium/long) and media delivery format.',
      raw: details.preferenceMatch || 0,
      weight: weights.preferences,
      weighted: (details.preferenceMatch || 0) * weights.preferences,
      color: 'bg-purple-600',
      textColor: 'text-purple-700'
    },
    {
      label: 'F — User Interaction & Feedback',
      desc: 'Reinforcement learning weight derived from your likes, course bookmarks, completions, and dismissals.',
      raw: details.feedbackScore || 0,
      weight: weights.feedback,
      weighted: (details.feedbackScore || 0) * weights.feedback,
      color: 'bg-rose-600',
      textColor: 'text-rose-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Cpu className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg">AI Recommendation Formula Breakdown</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/30 font-mono">
                  Explainable AI (XAI)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{course.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Formula Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scoring Formula</span>
              <span className="text-sm font-bold text-brand-600">
                Final Match Score: {course.matchScore}% ({details.finalScore?.toFixed(4) || 0})
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm bg-white p-3 rounded-lg border border-slate-200 text-slate-700 overflow-x-auto">
              S = 0.40(T) + 0.30(K) + 0.15(D) + 0.10(P) + 0.05(F)
            </div>
            <p className="text-xs text-slate-500 mt-2">
              All sub-scores are normalized between 0.0 and 1.0 using scikit-learn TF-IDF, skill Jaccard distance, and interaction weights.
            </p>
          </div>

          {/* Subscores List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Sub-Score Components
            </h4>

            {components.map((comp, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-brand-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{comp.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Weight: {(comp.weight * 100)}%</span>
                    <span className={`text-xs font-mono font-bold ${comp.textColor}`}>
                      Raw: {comp.raw.toFixed(3)}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      +{(comp.weighted).toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${comp.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(5, comp.raw * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{comp.desc}</p>
              </div>
            ))}
          </div>

          {/* Explanation rationale */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Natural Language Recommendation Reason
            </h5>
            <p className="text-sm text-emerald-800 leading-relaxed">
              "{course.recommendationReason}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
