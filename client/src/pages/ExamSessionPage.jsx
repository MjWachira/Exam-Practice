import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Send, LayoutGrid, X } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import { fetchQuestions, submitExamSession } from '../services/api';

export default function ExamSessionPage({ config, onCompleteSession, onCancel }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionKey }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [config]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetchQuestions({
        domain: config.domain,
        limit: config.limit,
        mode: config.mode
      });
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleToggleFlag = (qId) => {
    setFlaggedQuestions(prev => {
      const updated = new Set(prev);
      if (updated.has(qId)) {
        updated.delete(qId);
      } else {
        updated.add(qId);
      }
      return updated;
    });
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const payload = {
        mode: config.mode,
        selectedDomain: config.domain,
        userAnswers,
        timeTakenSeconds
      };

      const res = await submitExamSession(payload);
      onCompleteSession(res.data.session);
    } catch (err) {
      console.error('Submit exam error:', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading CSM Exam Questions from Excel sheet...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Questions Found</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">No questions matched the selected domain or Excel file.</p>
        <button onClick={onCancel} className="gradient-btn px-6 py-2.5 rounded-xl text-xs">Return to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20 animate-fade-in relative px-1 sm:px-4">
      
      {/* EXAM TOP CONTROL HEADER */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sticky top-16 sm:top-20 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
        
        {/* Left: Mode Badge & Cancel */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/30 transition-colors"
          >
            End Exam
          </button>

          <span className="hidden md:inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold uppercase">
            {config.mode === 'simulated' ? '60-Min Exam Simulator' : 'Practice Mode'}
          </span>
        </div>

        {/* Center: Timer */}
        <Timer
          initialSeconds={config.mode === 'simulated' ? 3600 : 0}
          isCountDown={config.mode === 'simulated'}
          onTick={(elapsedSecs) => setTimeTakenSeconds(elapsedSecs)}
          onTimeExpired={handleSubmitExam}
        />

        {/* Right: Drawer Grid & Submit */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Questions</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">({answeredCount}/{questions.length})</span>
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={submitting}
            className="gradient-btn px-3 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs uppercase tracking-wider flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* MAIN QUESTION CARD */}
      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selectedOption={userAnswers[currentQuestion.id]}
        onSelectOption={handleSelectOption}
        isFlagged={flaggedQuestions.has(currentQuestion.id)}
        onToggleFlag={handleToggleFlag}
        isPracticeMode={config.mode === 'practice'}
        showInstantFeedback={config.mode === 'practice'}
      />

      {/* BOTTOM NAVIGATION CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
            currentIndex === 0
              ? 'opacity-40 bg-slate-200 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold order-last sm:order-none">
          {answeredCount} of {questions.length} Answered
        </span>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl gradient-btn text-xs font-bold"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20"
          >
            <span>Review & Submit</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* QUESTION NAV DRAWER MODAL */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Question Palette Navigation</h3>
              <button onClick={() => setShowDrawer(false)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
              {questions.map((q, idx) => {
                const isAns = Boolean(userAnswers[q.id]);
                const isFlag = flaggedQuestions.has(q.id);
                const isCurr = idx === currentIndex;

                let btnStyle = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400';
                if (isAns) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                if (isCurr) btnStyle = 'ring-2 ring-emerald-500 bg-emerald-500 text-slate-950 font-extrabold';

                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIndex(idx); setShowDrawer(false); }}
                    className={`relative p-2.5 sm:p-3 rounded-xl border text-xs font-bold transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Submit Exam for Grading?</h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You have answered <span className="text-emerald-600 dark:text-emerald-400 font-bold">{answeredCount}</span> of <span className="text-slate-900 dark:text-slate-100 font-bold">{questions.length}</span> questions.
              {answeredCount < questions.length && (
                <span className="block text-amber-600 dark:text-amber-400 font-semibold mt-1">⚠️ You still have unanswered questions!</span>
              )}
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl gradient-btn text-xs font-bold"
              >
                {submitting ? 'Grading...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
