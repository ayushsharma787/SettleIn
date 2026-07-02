import React from 'react'
import { Logo, ChevronIcon, ProgressBar } from './ui'
import { PRIYA } from '../data'
import { buildRoadmap, preCompleted, progressOf } from '../engine'

export default function Welcome({ onIndividual, onEmployer, onResumePriya }) {
  const steps = buildRoadmap(PRIYA.answers)
  const prog = progressOf(steps, preCompleted(PRIYA.answers))

  return (
    <div className="screen-in min-h-full flex flex-col bg-gradient-to-b from-teal-600 via-teal-600 to-emerald-700 text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-6 text-center">
        <div className="pop-in">
          <Logo size="lg" light />
        </div>
        <div className="mt-6 text-5xl font-extrabold tracking-tight">Ahlan</div>
        <div className="mt-1 text-2xl text-teal-100/90 font-medium" dir="rtl">
          أهلاً
        </div>
        <p className="mt-5 text-teal-50 text-[15px] leading-relaxed max-w-[280px]">
          Your UAE settling-in companion.
          <br />
          <span className="font-semibold text-white">
            From six weeks of chaos to six hours of clarity.
          </span>
        </p>
      </div>

      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={onResumePriya}
          className="card-in w-full bg-white/10 hover:bg-white/15 border border-white/25 rounded-2xl p-4 text-left transition active:scale-[0.98]"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              P
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">Welcome back, {PRIYA.name} 👋</div>
              <div className="text-xs text-teal-100">
                {prog.done} of {prog.total} steps complete — continue your journey
              </div>
              <ProgressBar pct={prog.pct} className="mt-2" track="bg-white/25" />
            </div>
            <ChevronIcon className="w-4 h-4 text-teal-100 shrink-0" />
          </div>
        </button>

        <button
          onClick={onIndividual}
          className="card-in w-full bg-white text-teal-700 font-bold rounded-2xl py-4 shadow-xl shadow-teal-900/20 transition active:scale-[0.98] hover:bg-teal-50"
          style={{ animationDelay: '0.12s' }}
        >
          I’m an individual →
        </button>
        <button
          onClick={onEmployer}
          className="card-in w-full bg-teal-800/60 hover:bg-teal-800/80 border border-white/20 text-white font-bold rounded-2xl py-4 transition active:scale-[0.98]"
          style={{ animationDelay: '0.18s' }}
        >
          I’m an employer →
        </button>
        <p className="text-center text-[11px] text-teal-100/70 pt-1">
          Demo build · separate entry points in production
        </p>
      </div>
    </div>
  )
}
