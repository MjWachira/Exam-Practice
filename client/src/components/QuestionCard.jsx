import React from 'react';
import { Bookmark, CheckCircle2, XCircle, Info } from 'lucide-react';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isFlagged,
  onToggleFlag,
  isPracticeMode,
  showInstantFeedback
}) {
  if (!question) return null;

  const isAnswered = Boolean(selectedOption);
  const isCorrect = isPracticeMode && isAnswered && selectedOption.toUpperCase() === question.correctAnswer.toUpperCase();

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 relative border border-slate-200/80 dark:border-slate-700/60 shadow-2xl transition-all">
      
      {/* Header Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Domain Badge & Difficulty */}
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            {question.domain || 'Scrum Knowledge'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold">
            {question.difficulty || 'Medium'}
          </span>
        </div>

        {/* Question Counter & Flag Button */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Question <span className="text-slate-900 dark:text-slate-100 text-sm font-extrabold">{currentIndex + 1}</span> of {totalQuestions}
          </span>
          
          <button
            onClick={() => onToggleFlag(question.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>

      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Option Choices */}
      <div className="space-y-3.5 mb-8">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          let optionStyle = 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-slate-200/60 dark:hover:bg-slate-800/50';
          let keyBadgeStyle = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700';

          if (isSelected) {
            optionStyle = 'bg-violet-500/15 border-violet-500 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/40 shadow-md shadow-violet-500/10 font-semibold';
            keyBadgeStyle = 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-extrabold border-transparent';
          }

          if (isPracticeMode && showInstantFeedback && isAnswered) {
            if (opt.key.toUpperCase() === question.correctAnswer.toUpperCase()) {
              optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50';
              keyBadgeStyle = 'bg-emerald-500 text-slate-950 font-bold';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200';
              keyBadgeStyle = 'bg-rose-500 text-slate-100 font-bold';
            }
          }

          return (
            <button
              key={opt.key}
              onClick={() => onSelectOption(question.id, opt.key)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
            >
              <div className="flex items-center space-x-3.5">
                <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center text-xs transition-colors shrink-0 ${keyBadgeStyle}`}>
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-normal">{opt.text}</span>
              </div>

              {isPracticeMode && showInstantFeedback && isAnswered && (
                <div className="shrink-0 ml-2">
                  {opt.key.toUpperCase() === question.correctAnswer.toUpperCase() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Practice Mode Instant Explanation Box */}
      {isPracticeMode && showInstantFeedback && isAnswered && (
        <div className={`p-4 rounded-2xl border animate-fade-in ${
          isCorrect
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Official Scrum Alliance Explanation</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

    </div>
  );
}
