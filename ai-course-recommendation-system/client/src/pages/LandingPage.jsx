import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Map,
  Bot,
  Compass,
  ArrowRight,
  CheckCircle,
  Cpu,
  Layers,
  Star,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onExploreCatalog, onOpenAuth }) {
  const { demoLogin } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/60 via-indigo-50/40 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>MERN Stack + Python Machine Learning Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Stop Guessing What to Learn. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Personalized AI Course Guidance
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Move beyond simple keyword search. Our hybrid recommendation engine analyzes your current skills,
            evaluates career skill gaps, and sequences courses into an actionable roadmap.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Personalized Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreCatalog}
              className="px-6 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl transition-all shadow-sm flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Explore Course Catalog
            </button>

            <button
              onClick={() => demoLogin('student')}
              className="px-6 py-3 text-sm font-bold text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-2xl transition-all shadow-sm"
            >
              ⚡ 1-Click Demo Sign In
            </button>
          </div>

          {/* Social Proof metrics */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/60 mt-12">
            <div>
              <div className="text-3xl font-extrabold text-slate-900">30+</div>
              <div className="text-xs text-slate-500 mt-0.5">Curated Tech Courses</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-brand-600">6</div>
              <div className="text-xs text-slate-500 mt-0.5">Industry Career Pathways</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">0.775</div>
              <div className="text-xs text-slate-500 mt-0.5">MAP Model Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-indigo-600">&lt;20ms</div>
              <div className="text-xs text-slate-500 mt-0.5">TF-IDF Inference Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Core Capabilities</span>
          <h2 className="text-3xl font-bold text-slate-900">Engineered for Placement & Portfolio Excellence</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Combining machine learning rigor with a polished educational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Hybrid AI Recommendation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scikit-learn TF-IDF & cosine similarity merged with skill matching, difficulty fit, and reinforcement feedback.
            </p>
            <div className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg text-slate-700 border border-slate-200">
              S = 0.40T + 0.30K + 0.15D + 0.10P + 0.05F
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Skill-Gap Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compares your profile against target career requirements (Data Analyst, Full Stack, ML Engineer) to pinpoint missing competencies.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Dynamic Readiness Gauge
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Personalized Roadmap</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Organizes recommended courses into a logical 4-stage pedagogical path: Foundations, Applied Tools, Advanced Topics, and Capstone.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Prerequisite Dependency Graph
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Grounded AI Mentor</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive chatbot connected to catalog data. Answers curriculum questions and creates weekly schedules without hallucinations.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Grounded in Course Catalog
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Recommendation Simulation Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Interactive Live Preview</span>
                <h3 className="text-2xl font-bold mt-1">How Explainable AI Recommendations Work</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Hybrid Inference
              </span>
            </div>

            {/* Simulated Recommendation Result */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-500 text-white">Data Science</span>
                  <span className="text-xs text-slate-300">Coursera / Univ. of Michigan</span>
                </div>
                <span className="text-sm font-black text-emerald-400">96.4% Match Score</span>
              </div>

              <h4 className="text-lg font-bold text-white">Python for Data Analysis and Scientific Computing</h4>
              
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300 italic">
                "Directly bridges critical skill gaps in 'Python', 'Pandas' required for your Data Analyst career goal. Tailored difficulty match for a Beginner learner."
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Text Sim (T)</span>
                  <span className="font-bold text-blue-300">0.820</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Skill Match (K)</span>
                  <span className="font-bold text-emerald-300">0.875</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Difficulty (D)</span>
                  <span className="font-bold text-amber-300">1.000</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Pref Match (P)</span>
                  <span className="font-bold text-purple-300">0.850</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Feedback (F)</span>
                  <span className="font-bold text-rose-300">0.500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-900">Ready to Accelerate Your Career?</h2>
        <p className="text-sm text-slate-600">
          Build your learner profile in 60 seconds and let AI personalize your educational journey.
        </p>
        <div className="pt-2">
          <button
            onClick={() => demoLogin('student')}
            className="px-8 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-2xl shadow-lg transition-all"
          >
            Launch Interactive Dashboard Now
          </button>
        </div>
      </section>
    </div>
  );
}
