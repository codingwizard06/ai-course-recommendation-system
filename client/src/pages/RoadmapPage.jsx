import React, { useState, useEffect } from 'react';
import { Map, CheckCircle2, Clock, PlayCircle, Lock, Sparkles, ArrowRight, RotateCw, BookOpen, Layers } from 'lucide-react';
import { roadmapAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CourseModal from '../components/CourseModal';

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await roadmapAPI.getRoadmap();
      if (res.data) setRoadmap(res.data.roadmap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleStep = async (stepNumber, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    const nextCompleted = nextStatus === 'completed';

    try {
      const res = await roadmapAPI.updateStep(stepNumber, nextStatus, nextCompleted);
      if (res.data && res.data.roadmap) {
        setRoadmap(res.data.roadmap);
      }
    } catch (e) {
      alert('Failed to update step progress');
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await roadmapAPI.generateRoadmap(user?.careerGoal || 'Data Analyst');
      if (res.data) setRoadmap(res.data.roadmap);
    } catch (e) {
      alert('Failed to regenerate roadmap');
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall completed steps
  let totalStepsCount = 0;
  let completedStepsCount = 0;

  if (roadmap && roadmap.stages) {
    roadmap.stages.forEach(st => {
      st.steps.forEach(s => {
        totalStepsCount++;
        if (s.isCompleted || s.status === 'completed') completedStepsCount++;
      });
    });
  }

  const completionPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Map className="w-3.5 h-3.5" />
            Curriculum Sequence for: {roadmap?.careerGoal || user?.careerGoal || 'Data Analyst'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personalized Career Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            A sequenced pedagogical path from foundational prerequisites to applied tooling and a portfolio capstone.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="px-4 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Regenerate Sequence
        </button>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Milestone Completion</span>
          <div className="text-2xl sm:text-3xl font-black">
            {completedStepsCount} of {totalStepsCount} Steps Completed ({completionPercent}%)
          </div>
          <div className="w-full sm:w-80 bg-white/10 h-2.5 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        <div className="text-xs text-slate-300 sm:text-right space-y-1">
          <p>Estimated Total Study Time: ~{roadmap?.estimatedTotalWeeks || 24} weeks</p>
          <p className="text-slate-400">Based on 5-10 hours/week dedicated study</p>
        </div>
      </div>

      {/* Roadmap Stages */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : roadmap && roadmap.stages ? (
        <div className="space-y-8">
          {roadmap.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center">
                    {stageIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{stage.stageTitle}</h3>
                    <p className="text-xs text-slate-500">Duration: ~{stage.stageDurationWeeks || 4} weeks</p>
                  </div>
                </div>
              </div>

              {/* Steps Timeline in this Stage */}
              <div className="space-y-4">
                {stage.steps.map((step, stepIdx) => {
                  const isDone = step.isCompleted || step.status === 'completed';
                  const inProgress = step.status === 'in_progress';

                  return (
                    <div
                      key={stepIdx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : inProgress
                          ? 'bg-brand-50/40 border-brand-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-90'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Checkbox status button */}
                        <button
                          onClick={() => handleToggleStep(step.stepNumber, step.status)}
                          className={`p-1.5 rounded-xl border mt-0.5 transition-colors ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">Step {step.stepNumber}</span>
                            <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                              {step.difficulty}
                            </span>
                            {inProgress && (
                              <span className="text-[10px] font-extrabold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Current Milestone
                              </span>
                            )}
                          </div>
                          <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {step.provider} • ~{step.durationHours || 20} hours total
                          </p>
                        </div>
                      </div>

                      {/* Right metadata / Course Action */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs text-slate-400 font-medium">~{step.estimatedWeeks || 2} weeks</span>
                        <button
                          onClick={() => setSelectedCourse({ ...step, _id: step.courseId })}
                          className="px-3 py-1.5 text-xs font-semibold text-brand-600 bg-white hover:bg-brand-50 border border-brand-200 rounded-xl transition-colors flex items-center gap-1"
                        >
                          Course Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnrolled={fetchRoadmap}
        />
      )}
    </div>
  );
}
