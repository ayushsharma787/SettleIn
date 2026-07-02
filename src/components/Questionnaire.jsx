import React, { useEffect, useState } from 'react'
import { QUESTIONS } from '../data'
import { Header } from './ui'

export default function Questionnaire({ onBack, onDone }) {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [leaving, setLeaving] = useState(false)
  const q = QUESTIONS[idx]

  const pick = (value) => {
    if (leaving) return
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    setLeaving(true)
    setTimeout(() => {
      setLeaving(false)
      if (idx + 1 < QUESTIONS.length) setIdx(idx + 1)
      else onDone(next)
    }, 260)
  }

  const back = () => {
    if (idx === 0) onBack()
    else setIdx(idx - 1)
  }

  return (
    <div className="min-h-full flex flex-col bg-white">
      <Header
        title="Let’s personalize your journey"
        subtitle={`Question ${idx + 1} of ${QUESTIONS.length}`}
        onBack={back}
      />

      {/* progress dots */}
      <div className="flex gap-1.5 px-5 pt-4">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= idx ? 'bg-teal-500' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      <div
        key={idx}
        className={`flex-1 px-5 pt-8 pb-8 flex flex-col screen-in ${
          leaving ? 'opacity-0 transition-opacity duration-200' : ''
        }`}
      >
        <div className="text-4xl mb-4">{q.icon}</div>
        <h2 className="text-2xl font-extrabold text-stone-900 leading-snug mb-6">
          {q.q}
        </h2>
        <div className="space-y-3">
          {q.options.map((o, i) => (
            <button
              key={o.value}
              onClick={() => pick(o.value)}
              className={`card-in w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition active:scale-[0.98] ${
                answers[q.key] === o.value
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/40'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-2xl">{o.icon}</span>
              <span className="font-semibold text-stone-800">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GeneratingScreen({ onDone }) {
  const lines = [
    'Reading your visa type…',
    'Mapping step dependencies…',
    'Checking current processing times…',
    'Building your roadmap…',
  ]
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const int = setInterval(() => setShown((s) => Math.min(s + 1, lines.length)), 450)
    const done = setTimeout(onDone, 2100)
    return () => {
      clearInterval(int)
      clearTimeout(done)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="screen-in min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-emerald-700 text-white px-8">
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bounce-dot w-3 h-3 rounded-full bg-white"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="text-xl font-bold mb-6 text-center">
        Generating your personalized roadmap…
      </div>
      <div className="space-y-2 text-sm text-teal-100 min-h-[104px]">
        {lines.slice(0, shown).map((l) => (
          <div key={l} className="card-in flex items-center gap-2">
            <span className="text-emerald-300">✓</span> {l}
          </div>
        ))}
      </div>
    </div>
  )
}
