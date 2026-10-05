import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Briefcase, Plus, Trash2, Save, Check, Sparkles, Sliders } from 'lucide-react';
import { userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [preferredDuration, setPreferredDuration] = useState('medium');
  const [preferredFormat, setPreferredFormat] = useState('video');
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(10);

  // Skills array: [{ name, proficiency }]
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState(50);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEducationLevel(user.educationLevel || "Bachelor's Degree");
      setCareerGoal(user.careerGoal || 'Data Analyst');
      setExperienceLevel(user.experienceLevel || 'Beginner');
      setPreferredDuration(user.preferredDuration || 'medium');
      setPreferredFormat(user.preferredFormat || 'video');
      setWeeklyGoalHours(user.weeklyGoalHours || 10);
      setSkills(user.currentSkills || []);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setSkills(prev => [...prev, { name: newSkillName.trim(), proficiency: Number(newSkillProf) }]);
    setNewSkillName('');
    setNewSkillProf(50);
  };

  const handleRemoveSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkillProfChange = (index, value) => {
    const updated = [...skills];
    updated[index].proficiency = Number(value);
    setSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      await userAPI.updateProfile({
        name,
        educationLevel,
        careerGoal,
        experienceLevel,
        preferredDuration,
        preferredFormat,
        weeklyGoalHours,
        currentSkills: skills
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-7 h-7 text-brand-600" />
            Learning Profile & Competencies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep your skills and preferences up to date. Changes dynamically retune your recommendation model.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <Check className="w-4 h-4" />
            Profile Updated
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            Academic & General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Education Level</label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="e.g. Bachelor's in CS / Engineering"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Career Pathway</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="Data Analyst">Data Analyst</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Learning Style & Experience Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Practitioner)</option>
                <option value="Advanced">Advanced (Senior / Specialist)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Duration Pace</label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="short">Short (&lt;15 Hours)</option>
                <option value="medium">Medium (15-40 Hours)</option>
                <option value="long">Comprehensive (&gt;40 Hours)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Delivery Format</label>
              <select
                value={preferredFormat}
                onChange={(e) => setPreferredFormat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                <option value="video">Video Lectures</option>
                <option value="interactive">Interactive Coding Labs</option>
                <option value="project">Project-Based Learning</option>
                <option value="reading">Text & Reading Based</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Skills & Proficiency Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Current Skills & Proficiency Levels
            </h3>
            <span className="text-xs text-slate-400 font-medium">Factor K (Skill Match)</span>
          </div>

          <p className="text-xs text-slate-500">
            Slide each skill to indicate your current confidence level (0% to 100%).
          </p>

          {/* Add skill input strip */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add skill (e.g. React, SQL, Pandas)..."
              className="flex-1 min-w-[200px] px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none bg-white"
            />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Proficiency:</span>
              <input
                type="number"
                min="10"
                max="100"
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
                className="w-16 px-2 py-1.5 border border-slate-300 rounded-xl text-center bg-white"
              />
              <span>%</span>
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>

          {/* Existing skills list with sliders */}
          <div className="space-y-3 pt-2">
            {skills.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="sm:w-1/3">
                  <span className="font-bold text-xs text-slate-900">{s.name}</span>
                  <span className="text-xs font-mono text-slate-500 ml-2">({s.proficiency}%)</span>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={s.proficiency}
                    onChange={(e) => handleSkillProfChange(idx, e.target.value)}
                    className="w-full accent-brand-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 self-end sm:self-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Profile...' : 'Save & Retune AI Recommendations'}
          </button>
        </div>
      </form>
    </div>
  );
}
