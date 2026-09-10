import React, { useState, useEffect } from 'react';
import { Play, Flame, Award, BookOpen, CheckCircle2, FileSpreadsheet, Sparkles } from 'lucide-react';
import { fetchDomains, fetchUserAnalytics } from '../services/api';
import DomainRadarChart from '../components/DomainRadarChart';
import { useAuth } from '../context/AuthContext';

export default function HomeDashboard({ onStartExam, onOpenExcelModal, onOpenAuthModal }) {
  const { user } = useAuth();
  const [domains, setDomains] = useState(['All']);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [examMode, setExamMode] = useState('simulated'); // 'simulated' or 'practice'
  const [questionCount, setQuestionCount] = useState(15);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadDomains();
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadDomains = async () => {
    try {
      const res = await fetchDomains();
      if (res.data.domains) {
        setDomains(res.data.domains);
      }
    } catch (err) {
      console.error('Error fetching domains:', err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetchUserAnalytics();
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const handleLaunch = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    onStartExam({
      mode: examMode,
      domain: selectedDomain,
      limit: examMode === 'simulated' ? 50 : questionCount
    });
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 animate-fade-in">
      
      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-5 sm:p-8 lg:p-12 border border-slate-200/80 dark:border-slate-700/60 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-violet-600 dark:text-violet-400" />
              <span>Certified ScrumMaster (CSM) Question Bank</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Master the <span className="gradient-text">CSM Alliance</span> Exam with Confidence
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Simulate the official 50-question 60-minute CSM exam, practice domain by domain, and track your logged-in session scores read directly from Excel question databases.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>74% Official Pass Mark</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Excel Spreadsheet Reader</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Session Score History</span>
              </div>
            </div>
          </div>

          {/* EXAM LAUNCH CONTROL CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-2xl space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Start Practice Session</span>
              </h3>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Select Exam Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExamMode('simulated')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      examMode === 'simulated'
                        ? 'bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-300 font-bold ring-1 ring-violet-500/50'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Timed Simulator</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">60 min | Full Exam</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamMode('practice')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      examMode === 'practice'
                        ? 'bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-300 font-bold ring-1 ring-violet-500/50'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Practice Mode</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Instant Explanations</p>
                  </button>
                </div>
              </div>

              {/* Domain Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Scrum Domain</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-violet-500 focus:outline-none"
                >
                  {domains.map((dom) => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>
              </div>

              {/* Question Count (for practice mode) */}
              {examMode === 'practice' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Question Count: {questionCount}</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                    className="w-full accent-violet-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Launch Button */}
              <button
                onClick={handleLaunch}
                className="w-full py-3.5 rounded-xl gradient-btn text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span>Launch {examMode === 'simulated' ? '60-Min CSM Exam' : 'Practice Questions'}</span>
              </button>

              {!user && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400/90 text-center font-medium">
                  ⚡ Sign in or Guest login will open to track your scores.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* STATS OVERVIEW CARDS */}
      {user && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Pass Rate</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">{analytics?.passRate || 0}%</p>
              <p className="text-[10px] text-slate-500">{analytics?.passedAttempts || 0} of {analytics?.totalAttempts || 0} passed</p>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Average Score</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">{analytics?.averageScore || 0}%</p>
              <p className="text-[10px] text-slate-500">Highest: {analytics?.highestScore || 0}%</p>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Attempts</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">{analytics?.totalAttempts || 0}</p>
              <p className="text-[10px] text-slate-500">Exam Sessions</p>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Excel Question Bank</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Live Parsed</p>
              <button onClick={onOpenExcelModal} className="text-[10px] text-violet-600 dark:text-violet-400 underline font-semibold">Upload New Excel</button>
            </div>
          </div>
        </section>
      )}

      {/* SCRUM DOMAIN MASTERY CHART */}
      {user && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Scrum Alliance Domain Mastery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed performance across Scrum Roles, Events, Artifacts, & Theory</p>
            </div>
          </div>
          <DomainRadarChart domainBreakdown={analytics?.domainBreakdown} />
        </section>
      )}

    </div>
  );
}
