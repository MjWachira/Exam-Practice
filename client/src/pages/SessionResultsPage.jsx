import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import DomainRadarChart from '../components/DomainRadarChart';

export default function SessionResultsPage({ session, onRetake, onBackToDashboard }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'correct', 'incorrect'
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    if (session?.passed) {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [session]);

  if (!session) return null;

  const toggleExpand = (qId) => {
    setExpandedQuestions(prev => {
      const updated = new Set(prev);
      if (updated.has(qId)) updated.delete(qId);
      else updated.add(qId);
      return updated;
    });
  };

  const filteredAnswers = (session.answers || []).filter(item => {
    if (filterMode === 'correct') return item.isCorrect;
    if (filterMode === 'incorrect') return !item.isCorrect;
    return true;
  });

  const minutesTaken = Math.floor((session.timeTakenSeconds || 0) / 60);
  const secondsTaken = (session.timeTakenSeconds || 0) % 60;

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-20 animate-fade-in px-1 sm:px-4">
      
      {/* RESULT HERO CARD */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-2xl relative overflow-hidden text-center space-y-5 sm:space-y-6">
        
        {/* Background glow based on pass/fail */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          session.passed ? 'bg-emerald-500/15' : 'bg-rose-500/15'
        }`}></div>

        {/* Pass / Fail Status Badge */}
        <div className="relative z-10 space-y-3">
          <div className={`inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border ${
            session.passed
              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
              : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/40'
          }`}>
            {session.passed ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            <span className="text-center">{session.passed ? 'Passed Certified ScrumMaster Practice Exam' : 'Needs Practice (Did Not Meet 74% Pass Mark)'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100">
            {session.scorePercentage}%
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {session.correctAnswers} of {session.totalQuestions} Questions Correct
          </p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-2.5 sm:p-3 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Exam Mode</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{session.mode || 'Practice'}</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Time Spent</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{minutesTaken}m {secondsTaken}s</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">CSM Benchmark</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">74% Minimum</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Candidate</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{session.userName || 'Candidate'}</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto gradient-btn px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake CSM Exam</span>
          </button>
          
          <button
            onClick={onBackToDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

      </section>

      {/* DOMAIN BREAKDOWN CHART */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">Session Scrum Domain Breakdown</h3>
        <DomainRadarChart domainBreakdown={session.domainBreakdown} />
      </section>

      {/* DETAILED QUESTION REVIEW AUDIT */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">Detailed Question Audit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review every answer choice alongside official Scrum explanations</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              All ({session.answers?.length || 0})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'correct' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Correct ({session.answers?.filter(a => a.isCorrect).length || 0})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterMode === 'incorrect' ? 'bg-rose-500 text-slate-100' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Incorrect ({session.answers?.filter(a => !a.isCorrect).length || 0})
            </button>
          </div>
        </div>

        {/* AUDIT ITEMS LIST */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const isExpanded = expandedQuestions.has(item.questionId);

            return (
              <div
                key={item.questionId || idx}
                className={`glass-panel rounded-2xl p-4 sm:p-5 border transition-all ${
                  item.isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
                }`}
              >
                <div
                  onClick={() => toggleExpand(item.questionId)}
                  className="flex items-start justify-between cursor-pointer space-x-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Q{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
                          {item.domain}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{item.question}</h4>
                    </div>
                  </div>

                  <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3 animate-fade-in text-xs">
                    <div className="space-y-2">
                      {item.options.map(opt => {
                        const isSelected = item.selectedOption === opt.key;
                        const isCorrectKey = opt.key.toUpperCase() === item.correctAnswer.toUpperCase();

                        let optBadge = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                        if (isCorrectKey) optBadge = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        else if (isSelected && !item.isCorrect) optBadge = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';

                        return (
                          <div key={opt.key} className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${optBadge}`}>
                            <div className="flex items-start space-x-2.5">
                              <span className="font-bold shrink-0">{opt.key}.</span>
                              <span className="leading-snug">{opt.text}</span>
                            </div>
                            <div className="shrink-0 self-end sm:self-auto">
                              {isCorrectKey && <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-md">Correct Choice</span>}
                              {isSelected && !isCorrectKey && <span className="text-[10px] bg-rose-500 text-slate-100 font-bold px-2 py-0.5 rounded-md">Your Choice</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">📘 Scrum Guidance & Rationale:</p>
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
