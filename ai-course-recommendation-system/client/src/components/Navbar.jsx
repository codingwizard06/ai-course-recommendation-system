import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Target,
  Map,
  BookOpen,
  Bot,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, onNavigate, onOpenAuthModal }) {
  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers, authRequired: true },
    { id: 'catalog', label: 'Course Catalog', icon: Compass, authRequired: false },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, authRequired: true, badge: 'AI' },
    { id: 'skillgap', label: 'Skill-Gap Analyzer', icon: Target, authRequired: true },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, authRequired: true },
    { id: 'mylearning', label: 'My Learning', icon: BookOpen, authRequired: true },
    { id: 'assistant', label: 'AI Mentor', icon: Bot, authRequired: true, special: true },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Portal', icon: Shield, authRequired: true, adminOnly: true }] : [])
  ];

  const handleNav = (viewId) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Edu<span className="text-brand-600">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 tracking-wider">
                  ML-POWERED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none -mt-0.5">
                Smart Course & Career Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              if (item.authRequired && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${item.special ? 'border border-brand-200 text-brand-600' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Auth & Profile controls */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Profile pill */}
                <button
                  onClick={() => handleNav('profile')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    currentView === 'profile'
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="line-clamp-1">{user?.name}</p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => demoLogin('student')}
                  className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-colors"
                >
                  1-Click Demo Student
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-brand-600 rounded-xl shadow-sm transition-colors"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            {!isAuthenticated && (
              <button
                onClick={() => demoLogin('student')}
                className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 rounded-lg border border-brand-200"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map(item => {
            if (item.authRequired && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  My Profile ({user?.name})
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
              >
                Sign In or Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
