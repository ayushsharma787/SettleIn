import React from 'react'
import { Header, CheckIcon } from './ui'
import { TIERS, ALACARTE } from '../data'

const tierStyles = {
  free: {
    card: 'border-stone-200 bg-white',
    badge: 'bg-stone-100 text-stone-600',
    cta: 'bg-stone-100 text-stone-500',
    check: 'text-stone-400',
  },
  plus: {
    card: 'border-teal-500 border-2 bg-gradient-to-b from-teal-50/80 to-white shadow-xl shadow-teal-600/10',
    badge: 'bg-teal-600 text-white',
    cta: 'bg-teal-600 hover:bg-teal-700 text-white',
    check: 'text-teal-500',
  },
  concierge: {
    card: 'border-amber-300 bg-gradient-to-b from-amber-50/80 to-white',
    badge: 'bg-amber-500 text-white',
    cta: 'bg-stone-900 hover:bg-stone-800 text-white',
    check: 'text-amber-500',
  },
}

export default function Pricing({ onBack, onPreviewCalculator, showToast }) {
  const onCta = (tier) => {
    if (tier.id === 'free') showToast('You’re on the Guide plan — it’s free forever 🎉')
    else if (tier.id === 'plus') onPreviewCalculator()
    else showToast('✓ Request received — an advisor will reach out today (demo)')
  }

  return (
    <div className="screen-in min-h-full flex flex-col bg-stone-50">
      <Header title="Plans" subtitle="One journey, three levels of help" onBack={onBack} />
      <div className="flex-1 px-5 py-5 space-y-4 pb-10">
        {TIERS.map((tier, i) => {
          const s = tierStyles[tier.id]
          return (
            <div
              key={tier.id}
              className={`card-in rounded-3xl border p-5 ${s.card}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="text-lg font-extrabold text-stone-900">{tier.name}</div>
                  <div className="text-xs text-stone-500 italic">{tier.tagline}</div>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.badge}`}
                >
                  {tier.badge}
                </span>
              </div>
              <div className="my-3">
                <span className="text-3xl font-extrabold text-stone-900">{tier.price}</span>
                <span className="text-sm text-stone-500 ml-1.5">{tier.priceNote}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-stone-700">
                    <CheckIcon className={`w-4 h-4 mt-0.5 shrink-0 ${s.check}`} />
                    <span className={f.startsWith('Everything') ? 'font-bold' : ''}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onCta(tier)}
                className={`w-full py-3.5 rounded-2xl font-bold transition active:scale-[0.98] ${s.cta}`}
              >
                {tier.cta}
              </button>
            </div>
          )
        })}

        {/* à la carte */}
        <div className="pt-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-3">
            Also available à la carte
          </div>
          <div className="space-y-2.5">
            {ALACARTE.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-200"
              >
                <span className="text-xl">{a.icon}</span>
                <span className="flex-1 font-semibold text-sm text-stone-800">{a.name}</span>
                <span className="font-extrabold text-sm text-stone-900">{a.price}</span>
                <button
                  onClick={() => showToast(`✓ ${a.name} added (demo)`)}
                  className="text-xs font-bold text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-2 rounded-full transition active:scale-95"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
