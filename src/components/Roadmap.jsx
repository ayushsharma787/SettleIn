import React, { useState } from 'react'
import { Header, ProgressBar, CheckIcon, LockIcon, ChevronIcon, MenuIcon, CloseIcon } from './ui'
import { computeStates, currentStep, progressOf } from '../engine'

function StepCard({ step, isCurrent, readOnly, onOpen, delay }) {
  const { state } = step
  const base =
    'card-in w-full text-left rounded-2xl border transition flex items-center gap-3 p-4'
  if (state === 'done') {
    return (
      <button
        onClick={() => onOpen(step)}
        className={`${base} bg-emerald-50/70 border-emerald-100 active:scale-[0.99]`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-500 text-white flex items-center justify-center pop-in">
          <CheckIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-stone-500 line-through decoration-emerald-400/60 truncate">
            {step.title}
          </div>
          <div className="text-xs text-emerald-600 font-medium">Completed</div>
        </div>
      </button>
    )
  }
  if (state === 'locked') {
    return (
      <div
        className={`${base} bg-stone-50 border-stone-100 opacity-70`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="w-9 h-9 shrink-0 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center">
          <LockIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-stone-400 truncate">{step.title}</div>
          <div className="text-xs text-stone-400">
            Complete {step.blockers[0]?.title} first
          </div>
        </div>
      </div>
    )
  }
  // open
  return (
    <button
      onClick={() => onOpen(step)}
      className={`${base} active:scale-[0.98] ${
        isCurrent
          ? 'bg-white border-teal-400 border-2 shadow-lg shadow-teal-600/10 pulse-soft'
          : 'bg-white border-teal-200 hover:border-teal-400'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-9 h-9 shrink-0 rounded-full bg-teal-50 border-2 border-teal-400 flex items-center justify-center text-lg">
        {step.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 truncate">{step.title}</span>
          {isCurrent && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-teal-500 text-white px-2 py-0.5 rounded-full">
              {readOnly ? 'Current' : 'Up next'}
            </span>
          )}
        </div>
        <div className="text-xs text-stone-500 truncate">{step.subtitle}</div>
      </div>
      <ChevronIcon className="w-4 h-4 text-teal-500 shrink-0" />
    </button>
  )
}

export default function Roadmap({
  title,
  subtitle,
  steps,
  completedIds,
  readOnly = false,
  highlightId = null,
  onBack,
  onOpenStep,
  menuItems = [],
  banner = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const stated = computeStates(steps, completedIds)
  const prog = progressOf(steps, completedIds)
  const focus = highlightId || currentStep(stated)?.id
  const allDone = prog.done === prog.total

  return (
    <div className="screen-in min-h-full flex flex-col bg-stone-50">
      <Header
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        right={
          menuItems.length ? (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              className="p-2 rounded-full text-stone-500 hover:bg-stone-100 active:scale-95 transition"
            >
              <MenuIcon />
            </button>
          ) : null
        }
      />

      {/* progress */}
      <div className="px-5 pt-4 pb-1 bg-white border-b border-stone-100">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-bold text-stone-800">
            {allDone
              ? '🎉 All steps complete!'
              : `${prog.done} of ${prog.total} steps complete`}
          </span>
          <span className="text-sm font-extrabold text-teal-600">{prog.pct}%</span>
        </div>
        <ProgressBar pct={prog.pct} className="mb-4" />
      </div>

      {readOnly && (
        <div className="mx-5 mt-4 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-medium">
          👁 HR view — read-only. Progress is updated by the employee.
        </div>
      )}

      {/* timeline */}
      <div className="flex-1 px-5 py-4">
        <div className="relative">
          <div className="absolute left-[33px] top-4 bottom-4 w-0.5 bg-stone-200" />
          <div className="space-y-3 relative">
            {stated.map((s, i) => (
              <div key={s.id} className="relative pl-0">
                <StepCard
                  step={s}
                  isCurrent={s.id === focus}
                  readOnly={readOnly}
                  onOpen={onOpenStep}
                  delay={Math.min(i * 0.04, 0.4)}
                />
              </div>
            ))}
          </div>
        </div>
        {banner}
      </div>

      {/* slide-over menu */}
      {menuOpen && (
        <div className="absolute inset-0 z-30">
          <div className="absolute inset-0 bg-stone-900/40 fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl modal-in p-5 flex flex-col gap-1 rounded-l-3xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-extrabold text-stone-900">
                Menu <span className="text-teal-600 text-sm font-semibold" dir="rtl">أهلاً</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            {menuItems.map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  setMenuOpen(false)
                  m.onClick()
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-left font-semibold text-stone-700 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                <span className="text-lg">{m.icon}</span> {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
