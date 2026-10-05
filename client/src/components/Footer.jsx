import React from 'react';
import { Cpu, Database, Server, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>AI-Powered Course Recommendation System</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A modern learning platform designed for career readiness. Combines content-based TF-IDF vectorization,
              cosine similarity, skill-gap analysis, and interactive learning roadmap sequencing to accelerate student growth.
            </p>
          </div>

          {/* Architecture Badges */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">System Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-brand-400" />
                <span>Frontend: React + Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Backend: Node.js + Express REST API</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Database: MongoDB / Resilient Store</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>AI/ML Engine: Python + Scikit-Learn</span>
              </li>
            </ul>
          </div>

          {/* AI Recommender Specs */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">ML Model Formula</h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
              S = 0.40T + 0.30K + 0.15D + 0.10P + 0.05F
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Validated with Precision@K, Recall@K, and NDCG@K against Popularity Baselines.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
          <p>© 2026 AI-Powered Course Recommendation System. Full-Stack Portfolio & Placement Ready.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Recommendation Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
