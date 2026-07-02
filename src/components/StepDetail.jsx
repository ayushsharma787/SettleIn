import React, { useState } from 'react'
import { Header, CheckIcon, ExternalIcon, Modal } from './ui'
import { PARTNERS } from '../data'

function DocChecklist({ docs, checks, onToggle, readOnly }) {
  return (
    <div className="space-y-2">
      {docs.map((d, i) => (
        <button
          key={d}
          disabled={readOnly}
          onClick={() => onToggle(i)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition ${
            checks[i]
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-white border-stone-200 hover:border-teal-300'
          } ${readOnly ? 'cursor-default' : 'active:scale-[0.99]'}`}
        >
          <span
            className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition ${
              checks[i]
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-stone-300 text-transparent'
            }`}
          >
            <CheckIcon className="w-3.5 h-3.5" />
          </span>
          <span
            className={`text-sm font-medium ${
              checks[i] ? 'text-stone-500 line-through decoration-emerald-400/70' : 'text-stone-800'
            }`}
          >
            {d}
          </span>
        </button>
      ))}
    </div>
  )
}

function ReferralSection({ partners, onConnect }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
          Recommended for you
        </span>
        <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-semibold">
          Partner offers
        </span>
      </div>
      <div className="space-y-2.5">
        {partners.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-gradient-to-r from-white to-teal-50/50"
          >
            <span className="text-2xl">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-stone-900">{p.name}</div>
              <div className="text-xs text-stone-500">{p.tag}</div>
            </div>
            <button
              onClick={() => onConnect(p)}
              className="shrink-0 text-xs font-bold text-teal-700 bg-teal-100 hover:bg-teal-200 px-3.5 py-2 rounded-full transition active:scale-95"
            >
              Connect me
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StepDetail({
  step,
  readOnly = false,
  docChecks,
  onToggleDoc,
  onBack,
  onComplete,
  showToast,
}) {
  const [consentPartner, setConsentPartner] = useState(null)
  const done = step.state === 'done'
  const partners = step.referrals ? PARTNERS[step.referrals] : null
  const checks = docChecks || {}
  const depsDone = step.deps.length > 0 && step.state !== 'locked'

  return (
    <div className="screen-in min-h-full flex flex-col bg-stone-50">
      <Header title={step.title} subtitle={step.subtitle} onBack={onBack} />

      <div className="flex-1 px-5 py-5 pb-8">
        {/* status + icon */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
              done ? 'bg-emerald-100' : 'bg-teal-50 border-2 border-teal-200'
            }`}
          >
            {done ? '✅' : step.icon}
          </div>
          <div>
            <div
              className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                done ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'
              }`}
            >
              {done ? 'Completed' : 'In progress'}
            </div>
            <div className="text-xs text-stone-500 mt-1.5 flex flex-col gap-0.5">
              <span>⏱ {step.time}</span>
              <span>📊 {step.wait}</span>
            </div>
          </div>
        </div>

        {/* dependency note */}
        {depsDone && !done && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 text-xs font-medium card-in">
            🔓 This step unlocked because{' '}
            <span className="font-bold">
              {step.depTitles?.length
                ? `${step.depTitles.join(' & ')} ${step.depTitles.length > 1 ? 'are' : 'is'}`
                : 'an earlier step is'}{' '}
              complete
            </span>
            .
          </div>
        )}

        {/* documents */}
        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
          Required documents
        </div>
        <DocChecklist
          docs={step.docs}
          checks={checks}
          onToggle={onToggleDoc}
          readOnly={readOnly}
        />

        {/* portal */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            showToast(`In production this opens the official portal ↗`)
          }}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl py-3.5 transition active:scale-[0.98]"
        >
          {step.portal} <ExternalIcon />
        </a>

        {/* mistake tip */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/70">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1">
            ⚠️ Common mistake to avoid
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">{step.mistake}</p>
        </div>

        {/* referrals */}
        {partners && !readOnly && (
          <ReferralSection partners={partners} onConnect={setConsentPartner} />
        )}

        {/* actions */}
        {!readOnly && !done && (
          <button
            onClick={onComplete}
            className="mt-7 w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold rounded-2xl py-4 shadow-lg shadow-teal-600/25 transition active:scale-[0.98]"
          >
            ✓ Mark as complete
          </button>
        )}
        {!readOnly && done && (
          <div className="mt-7 text-center text-sm font-semibold text-emerald-600">
            ✓ You completed this step. Nice work!
          </div>
        )}
      </div>

      {/* consent modal */}
      <Modal open={!!consentPartner} onClose={() => setConsentPartner(null)}>
        {consentPartner && (
          <div className="p-6">
            <div className="text-3xl mb-3">{consentPartner.icon}</div>
            <h3 className="text-lg font-extrabold text-stone-900 mb-2">
              Share your contact details with {consentPartner.name}?
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Your data is only shared with your explicit consent, for this specific
              purpose. {consentPartner.name} will contact you about:{' '}
              <span className="font-semibold text-stone-800">{consentPartner.tag}</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConsentPartner(null)}
                className="flex-1 py-3 rounded-xl border-2 border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const name = consentPartner.name
                  setConsentPartner(null)
                  showToast(`✓ Request sent — ${name} will contact you within 1 working day`)
                }}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition active:scale-[0.98]"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
