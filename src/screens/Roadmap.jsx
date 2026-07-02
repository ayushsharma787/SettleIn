import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { progressFor } from '../lib/roadmap.js';
import { STEP_MAP } from '../data/steps.js';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { RoadmapTimeline } from '../components/RoadmapTimeline.jsx';
import { Logo } from '../components/Logo.jsx';
import { Calculator, Crown, Sparkles, RefreshCw, X } from 'lucide-react';

export function Roadmap() {
  const { profile, answers, roadmap, openStep, navigate, resetTo, startQuestionnaire, justUnlockedId } = useApp();
  const { stepIds, completed } = roadmap;
  const { done, total, pct } = progressFor(stepIds, completed);
  const [menuOpen, setMenuOpen] = useState(false);

  const nextId = stepIds.find((s) => !completed.has(s));
  const nextName = nextId ? STEP_MAP[nextId].title : null;

  return (
    <div className="flex flex-col min-h-full screen-in">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => resetTo('welcome')}
              aria-label="Back to home"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <Logo size="sm" />
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-xs font-bold text-brand-700 bg-brand-50 rounded-full px-3 py-1.5 ring-1 ring-brand-100 hover:bg-brand-100 transition inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Upgrade
          </button>
        </div>
      </div>

      {/* Profile + progress */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-extrabold shrink-0">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-lg leading-tight truncate">
              {profile.name === 'You' ? 'Your roadmap' : profile.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {[profile.company && `Sponsored by ${profile.company}`, answers.visaType, answers.emirate, answers.family]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-4 shadow-sm">
          <ProgressBar pct={pct} done={done} total={total} />
          <div className="mt-2.5 text-xs text-slate-500">
            {pct === 100
              ? "🎉 You're fully settled in. Ahlan!"
              : `Next up: ${nextName} — tap it below to begin.`}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-6 flex-1">
        <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-3">
          Your settling-in journey
        </div>
        <RoadmapTimeline
          stepIds={stepIds}
          completed={completed}
          onStepClick={openStep}
          justUnlockedId={justUnlockedId}
        />
      </div>

      {/* Bottom quick actions */}
      <div className="sticky bottom-0 w-full px-4 pb-4 pt-6 bg-gradient-to-t from-white via-white to-transparent">
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('calculator')}
            className="flex-1 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm py-3 font-bold text-slate-700 text-sm inline-flex items-center justify-center gap-2 hover:ring-brand-300 active:scale-[0.98] transition"
          >
            <Calculator className="w-4 h-4 text-brand-600" /> Cost calculator
          </button>
          <button
            onClick={() => navigate('tiers')}
            className="flex-1 rounded-2xl bg-slate-900 text-white shadow-sm py-3 font-bold text-sm inline-flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Crown className="w-4 h-4 text-amber-300" /> See plans
          </button>
        </div>
      </div>

      {/* Upgrade sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40" />
          <div
            className="relative w-full bg-white rounded-t-3xl p-5 pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-extrabold text-slate-900">Do more with Ahlan</h3>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Free guidance always. Upgrade when you want the paperwork done for you.</p>
            <button onClick={() => { setMenuOpen(false); navigate('tiers'); }} className="w-full rounded-2xl bg-brand-600 text-white font-bold py-3.5 mb-2.5 active:scale-[0.99] transition inline-flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-amber-300" /> Compare plans
            </button>
            <button onClick={() => { setMenuOpen(false); navigate('calculator'); }} className="w-full rounded-2xl bg-brand-50 text-brand-700 font-bold py-3.5 mb-2.5 ring-1 ring-brand-100 active:scale-[0.99] transition inline-flex items-center justify-center gap-2">
              <Calculator className="w-4 h-4" /> First-3-months cost calculator
            </button>
            <button onClick={() => { setMenuOpen(false); startQuestionnaire(); }} className="w-full rounded-2xl text-slate-600 font-semibold py-3 active:scale-[0.99] transition inline-flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Restart questionnaire
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
