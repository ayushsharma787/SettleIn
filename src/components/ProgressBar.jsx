export function ProgressBar({ pct, done, total, label = true }) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-slate-700">
            {done} of {total} steps complete
          </span>
          <span className="text-sm font-extrabold text-brand-600">{pct}%</span>
        </div>
      )}
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 bar-fill transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Small inline progress bar for employee cards.
export function MiniBar({ pct, color = 'from-brand-400 to-brand-600' }) {
  return (
    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
