import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ initialSeconds = 3600, isCountDown = true, onTimeExpired, onTick }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const nextSec = isCountDown ? prev - 1 : prev + 1;
        if (onTick) onTick(isCountDown ? initialSeconds - nextSec : nextSec);
        
        if (isCountDown && nextSec <= 0) {
          clearInterval(interval);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountDown, initialSeconds, onTimeExpired, onTick]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = isCountDown && secondsLeft <= 300; // less than 5 min
  const isCriticalTime = isCountDown && secondsLeft <= 180; // less than 3 min

  return (
    <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
      isCriticalTime
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
        : isLowTime
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
        : 'bg-slate-900/80 text-emerald-400 border-slate-700/60'
    }`}>
      {isCriticalTime ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Clock className="w-4 h-4 text-emerald-400" />
      )}
      <span className="font-mono text-sm tracking-wider">{formatTime(secondsLeft)}</span>
      <span className="text-[10px] uppercase text-slate-400 font-normal">
        {isCountDown ? 'Remaining' : 'Elapsed'}
      </span>
    </div>
  );
}
