// Centers the app in a phone-sized column on desktop while staying full-bleed
// on real mobile. Everything renders inside this frame.
export function PhoneFrame({ children }) {
  return (
    <div className="w-full min-h-screen flex justify-center sm:py-6">
      <div className="relative w-full max-w-[430px] bg-white sm:rounded-[2.25rem] sm:shadow-2xl sm:shadow-slate-400/30 sm:ring-1 sm:ring-slate-200/70 overflow-hidden flex flex-col min-h-screen sm:min-h-[900px]">
        {children}
      </div>
    </div>
  );
}

export function TopBar({ title, onBack, right }) {
  return (
    <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center gap-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
      ) : (
        <div className="w-9" />
      )}
      <div className="flex-1 text-center font-bold text-slate-800 truncate">{title}</div>
      <div className="min-w-9 flex justify-end">{right}</div>
    </div>
  );
}
