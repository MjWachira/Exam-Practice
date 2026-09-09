import React from 'react';
import { Bookmark, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

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
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative border border-slate-700/60 shadow-2xl transition-all">
      
      {/* Header Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        
        {/* Domain Badge & Question Counter */}
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {question.domain || 'Scrum Knowledge'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
            {question.difficulty || 'Medium'}
          </span>
        </div>

        {/* Question Counter & Flag Button */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-slate-400">
            Question <span className="text-slate-100 text-sm font-extrabold">{currentIndex + 1}</span> of {totalQuestions}
          </span>
          
          <button
            onClick={() => onToggleFlag(question.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 text-slate-400 hover:text-amber-400 border border-slate-700/50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>

      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Option Choices */}
      <div className="space-y-3.5 mb-8">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          let optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';
          let keyBadgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

          if (isSelected) {
            optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10';
            keyBadgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold';
          }

          if (isPracticeMode && showInstantFeedback && isAnswered) {
            if (opt.key.toUpperCase() === question.correctAnswer.toUpperCase()) {
              optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
              keyBadgeStyle = 'bg-emerald-500 text-slate-950 font-bold';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
              keyBadgeStyle = 'bg-rose-500 text-slate-100 font-bold';
            }
          }

          return (
            <button
              key={opt.key}
              onClick={() => onSelectOption(question.id, opt.key)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition-colors shrink-0 ${keyBadgeStyle}`}>
                  {opt.key}
                </span>
                <span className="text-sm font-medium leading-normal">{opt.text}</span>
              </div>

              {isPracticeMode && showInstantFeedback && isAnswered && (
                <div>
                  {opt.key.toUpperCase() === question.correctAnswer.toUpperCase() && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400" />
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
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-2">
            <Info className="w-4 h-4" />
            <span>Official Scrum Alliance Explanation</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

    </div>
  );
}
