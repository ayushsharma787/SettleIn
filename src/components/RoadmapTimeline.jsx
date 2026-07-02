import { STEP_MAP } from '../data/steps.js';
import { deriveStatuses, prerequisiteTitle } from '../lib/roadmap.js';
import { Icon } from './Icon.jsx';
import { Lock, Check, ChevronRight } from 'lucide-react';

export function RoadmapTimeline({ stepIds, completed, onStepClick, readOnly = false, justUnlockedId = null }) {
  const statuses = deriveStatuses(stepIds, completed);

  return (
    <div className="relative">
      {/* vertical spine */}
      <div className="absolute left-[27px] top-3 bottom-3 w-0.5 bg-slate-100" aria-hidden />

      <div className="space-y-3">
        {statuses.map(({ id, status }, i) => {
          const step = STEP_MAP[id];
          const isDone = status === 'done';
          const isCurrent = status === 'current';
          const isLocked = status === 'locked';
          const clickable = !isLocked && (!readOnly || true); // locked never clickable
          const prereq = prerequisiteTitle(stepIds, id);
          const glow = justUnlockedId === id;

          return (
            <div key={id} className="relative flex gap-3.5 fade-up" style={{ animationDelay: `${i * 45}ms` }}>
              {/* node */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-4 ring-white ${
                    isDone
                      ? 'bg-brand-500 text-white'
                      : isCurrent
                      ? 'bg-white text-brand-600 shadow-lg shadow-brand-500/20 ring-brand-100'
                      : 'bg-slate-100 text-slate-400'
                  } ${glow ? 'unlock-glow' : ''}`}
                >
                  {isDone ? (
                    <Check className="w-6 h-6 check-pop" strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Icon name={step.icon} className="w-6 h-6" />
                  )}
                </div>
              </div>

              {/* card */}
              <button
                disabled={isLocked || (readOnly && isLocked)}
                onClick={() => clickable && onStepClick?.(id)}
                className={`flex-1 text-left rounded-2xl px-4 py-3.5 ring-1 transition min-w-0 ${
                  isLocked
                    ? 'bg-slate-50 ring-slate-100 cursor-default'
                    : isCurrent
                    ? 'bg-brand-50/60 ring-brand-200 hover:ring-brand-300 active:scale-[0.99] shadow-sm'
                    : 'bg-white ring-slate-200 hover:ring-brand-200 active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`font-bold truncate ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                    {step.title}
                  </div>
                  {isCurrent && !readOnly && (
                    <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wide bg-brand-500 text-white rounded-full px-2 py-0.5">
                      Now
                    </span>
                  )}
                  {isDone && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-brand-600">Done</span>
                  )}
                </div>
                {isLocked ? (
                  <div className="mt-0.5 text-xs text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {prereq ? `Complete ${prereq} first` : 'Locked'}
                  </div>
                ) : (
                  <div className={`mt-0.5 text-xs truncate ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                    {step.blurb}
                  </div>
                )}
              </button>

              {!isLocked && (
                <div className="self-center shrink-0 -ml-1">
                  <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-brand-400' : 'text-slate-300'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
