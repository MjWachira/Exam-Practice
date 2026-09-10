import React, { useState, useEffect } from 'react';
import { History, Eye } from 'lucide-react';
import { fetchUserSessions } from '../services/api';

export default function SessionHistoryPage({ onViewSessionDetail }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchUserSessions();
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Error fetching session history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filterMode === 'passed') return s.passed;
    if (filterMode === 'failed') return !s.passed;
    if (filterMode === 'simulated') return s.mode === 'simulated';
    if (filterMode === 'practice') return s.mode === 'practice';
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-4 h-4" />
            <span>Logged-in Session Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Exam Attempt History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review your past scores, timestamp logs, and domain mastery over time</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setFilterMode('passed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'passed' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Passed ({sessions.filter(s => s.passed).length})
          </button>
          <button
            onClick={() => setFilterMode('failed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'failed' ? 'bg-rose-500 text-slate-100' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Failed ({sessions.filter(s => !s.passed).length})
          </button>
        </div>
      </div>

      {/* SESSIONS TABLE / CARDS */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <History className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Exam Sessions Logged Yet</h3>
          <p className="text-xs text-slate-500">Complete practice exams or timed simulations to record session history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSessions.map((sess) => {
            const minutes = Math.floor((sess.timeTakenSeconds || 0) / 60);
            const seconds = (sess.timeTakenSeconds || 0) % 60;
            const dateStr = new Date(sess.timestamp).toLocaleString();

            return (
              <div
                key={sess.id}
                onClick={() => onViewSessionDetail(sess)}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 flex flex-wrap items-center justify-between gap-4 group"
              >
                
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    sess.passed ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                  }`}>
                    {sess.scorePercentage}%
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        sess.passed ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-800 dark:text-rose-300'
                      }`}>
                        {sess.passed ? 'PASSED' : 'FAILED'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize font-medium">{sess.mode} Mode</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Questions</p>
                    <p className="font-bold">{sess.correctAnswers} / {sess.totalQuestions}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Time Spent</p>
                    <p className="font-bold">{minutes}m {seconds}s</p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
