import React, { useMemo, useState } from 'react'
import { Header } from './ui'
import { AREAS, EMIRATES, FAMILY_RENT_FACTOR } from '../data'

const fmt = (n) => `AED ${Math.round(n).toLocaleString('en-US')}`

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm font-bold transition active:scale-95 ${
        active
          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
          : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300'
      }`}
    >
      {children}
    </button>
  )
}

export default function Calculator({ onBack }) {
  const [emirate, setEmirate] = useState('dubai')
  const [family, setFamily] = useState(1)
  const [areaIdx, setAreaIdx] = useState(0)

  const areas = AREAS[emirate]
  const area = areas[Math.min(areaIdx, areas.length - 1)]
  const em = EMIRATES[emirate]

  const rows = useMemo(() => {
    const monthlyRent = area.rent * FAMILY_RENT_FACTOR[family]
    const annualRent = monthlyRent * 12
    const children = family >= 4 ? 2 : family === 3 ? 1 : 0
    const r = [
      { label: 'Rent (first 3 months)', icon: '🏠', value: monthlyRent * 3 },
      { label: 'Security deposit (5% of annual rent)', icon: '🔐', value: annualRent * 0.05 },
      { label: `${em.tenancy} registration fee`, icon: '📄', value: em.tenancyFee },
      { label: `${em.utility} deposit`, icon: '💡', value: em.utilityDeposit },
      { label: 'Internet & mobile setup', icon: '📶', value: 500 + 199 * 3 },
      { label: `Health insurance (${family} ${family > 1 ? 'people' : 'person'})`, icon: '🏥', value: 1500 * family },
      ...(children
        ? [{ label: `School deposit (${children} ${children > 1 ? 'children' : 'child'})`, icon: '🏫', value: 2500 * children }]
        : []),
      { label: 'Transport (3 months)', icon: '🚇', value: em.transport3mo },
    ]
    return r
  }, [area, family, em])

  const total = rows.reduce((s, r) => s + r.value, 0)

  const switchEmirate = (key) => {
    setEmirate(key)
    setAreaIdx(0)
  }

  return (
    <div className="screen-in min-h-full flex flex-col bg-stone-50">
      <Header
        title="Cost calculator"
        subtitle="Your first 3 months, estimated"
        onBack={onBack}
      />
      <div className="flex-1 px-5 py-5 pb-10">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full mb-5">
          ✨ Plus feature preview
        </div>

        {/* emirate */}
        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
          Emirate
        </div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.entries(EMIRATES).map(([key, e]) => (
            <Pill key={key} active={emirate === key} onClick={() => switchEmirate(key)}>
              {e.label}
            </Pill>
          ))}
        </div>

        {/* family size */}
        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
          Family size
        </div>
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4].map((n) => (
            <Pill key={n} active={family === n} onClick={() => setFamily(n)}>
              {n === 4 ? '4+' : n}
            </Pill>
          ))}
        </div>

        {/* area */}
        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
          Area preference
        </div>
        <select
          value={areaIdx}
          onChange={(e) => setAreaIdx(Number(e.target.value))}
          className="w-full mb-6 p-3.5 rounded-2xl border border-stone-200 bg-white font-semibold text-stone-800 focus:outline-none focus:border-teal-400"
        >
          {areas.map((a, i) => (
            <option key={a.name} value={i}>
              {a.name} — from {fmt(a.rent)}/mo
            </option>
          ))}
        </select>

        {/* breakdown */}
        <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 text-xs font-extrabold uppercase tracking-wider text-stone-500">
            Estimated breakdown
          </div>
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 px-4 py-3 border-b border-stone-50 last:border-0"
            >
              <span className="text-lg">{r.icon}</span>
              <span className="flex-1 text-sm font-medium text-stone-700">{r.label}</span>
              <span className="text-sm font-bold text-stone-900 tabular-nums">
                {fmt(r.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
            <span className="font-bold">Estimated 3-month total</span>
            <span className="text-xl font-extrabold tabular-nums">{fmt(total)}</span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-stone-400 leading-relaxed">
          Indicative estimates for demo purposes. Plus subscribers get live figures
          personalized to their visa type, employer benefits and family profile.
        </p>
      </div>
    </div>
  )
}
