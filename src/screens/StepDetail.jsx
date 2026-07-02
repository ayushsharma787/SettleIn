import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { STEP_MAP } from '../data/steps.js';
import { REFERRALS } from '../data/referrals.js';
import { portalLabel } from '../data/portals.js';
import { prerequisiteTitle } from '../lib/roadmap.js';
import { TopBar } from '../components/PhoneFrame.jsx';
import { Icon } from '../components/Icon.jsx';
import {
  ExternalLink, Clock, AlertTriangle, Check, ShieldCheck, ArrowRight, X, Unlock, Info,
} from 'lucide-react';

export function StepDetail() {
  const { activeStepId, roadmap, answers, completeStep, goBack, justUnlockedId } = useApp();
  const step = STEP_MAP[activeStepId];
  const isDone = roadmap.completed.has(activeStepId);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [consentFor, setConsentFor] = useState(null);
  const [connected, setConnected] = useState({});
  const [completedNow, setCompletedNow] = useState(false);

  useEffect(() => {
    setCheckedDocs({});
    setCompletedNow(false);
  }, [activeStepId]);

  if (!step) return null;

  const portal = portalLabel(answers.emirate, step.portalKey);
  const referral = step.referral ? REFERRALS[step.referral] : null;
  const prereq = prerequisiteTitle(roadmap.stepIds, activeStepId);
  const wasJustUnlocked = justUnlockedId === activeStepId || (!isDone && prereq);

  const handleComplete = () => {
    completeStep(activeStepId);
    setCompletedNow(true);
    setTimeout(() => goBack(), 700);
  };

  const confirmConsent = () => {
    setConnected((c) => ({ ...c, [consentFor.id]: true }));
    setConsentFor(null);
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title={step.title} onBack={goBack} />

      <div className="flex-1 px-5 py-5 screen-in">
        {/* Header card */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center shrink-0">
              <Icon name={step.icon} className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-100/90">
                {isDone ? 'Completed' : 'Current step'}
              </div>
              <h2 className="text-xl font-extrabold leading-tight mt-0.5">{step.title}</h2>
              <p className="text-sm text-brand-50/85 mt-1">{step.blurb}</p>
            </div>
          </div>
        </div>

        {/* Dependency note */}
        {!isDone && prereq && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-brand-50 ring-1 ring-brand-100 px-4 py-3">
            <Unlock className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <div className="text-sm text-brand-800">
              This step unlocked because <span className="font-bold">{prereq}</span> is complete.
            </div>
          </div>
        )}

        {/* Processing time */}
        <div className="mt-4 grid grid-cols-1 gap-2.5">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Typical processing time</div>
              <div className="text-sm font-semibold text-slate-800">{step.processingTime}</div>
              <div className="text-xs text-slate-500">{step.currentWait}</div>
            </div>
          </div>
        </div>

        {/* Required documents */}
        {step.docs.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-2.5">
              Documents to prepare
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 divide-y divide-slate-100 overflow-hidden">
              {step.docs.map((doc) => {
                const on = !!checkedDocs[doc];
                return (
                  <button
                    key={doc}
                    onClick={() => setCheckedDocs((c) => ({ ...c, [doc]: !c[doc] }))}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                        on ? 'bg-brand-500 border-brand-500' : 'border-slate-300'
                      }`}
                    >
                      {on && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm ${on ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{doc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Portal button */}
        {portal && (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-4 w-full rounded-2xl bg-slate-900 text-white font-bold py-3.5 flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            {portal} <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Common mistake */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-amber-700">Common mistake to avoid</div>
            <div className="text-sm text-amber-900 mt-0.5 leading-snug">{step.mistake}</div>
          </div>
        </div>

        {/* Referral cards */}
        {referral && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkle />
              <div className="text-sm font-extrabold text-slate-800">{referral.heading}</div>
            </div>
            <div className="space-y-2.5">
              {referral.partners.map((p) => {
                const isConnected = connected[p.id];
                return (
                  <div key={p.id} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                        {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-sm text-slate-600">{p.tagline}</div>
                        <div className="text-xs text-brand-600 font-semibold mt-0.5">{p.perk}</div>
                      </div>
                    </div>
                    <button
                      disabled={isConnected}
                      onClick={() => setConsentFor(p)}
                      className={`mt-3 w-full rounded-xl py-2.5 font-bold text-sm inline-flex items-center justify-center gap-2 transition active:scale-[0.99] ${
                        isConnected
                          ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200'
                          : 'bg-brand-600 text-white'
                      }`}
                    >
                      {isConnected ? (
                        <><Check className="w-4 h-4" /> Request sent</>
                      ) : (
                        <>Connect me <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Info className="w-3 h-3" /> Ahlan earns a referral fee — never charged to you.
            </div>
          </div>
        )}
      </div>

      {/* Sticky complete button */}
      {!isDone && (
        <div className="sticky bottom-0 w-full px-4 pb-4 pt-6 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={handleComplete}
            disabled={completedNow}
            className="w-full rounded-2xl bg-brand-600 text-white font-extrabold py-4 flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg shadow-brand-600/25"
          >
            {completedNow ? (
              <><Check className="w-5 h-5 check-pop" strokeWidth={3} /> Completed!</>
            ) : (
              <>Mark as complete <Check className="w-5 h-5" strokeWidth={3} /></>
            )}
          </button>
        </div>
      )}
      {isDone && (
        <div className="sticky bottom-0 w-full px-4 pb-4 pt-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="w-full rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 font-bold py-4 flex items-center justify-center gap-2">
            <Check className="w-5 h-5" strokeWidth={3} /> Step completed
          </div>
        </div>
      )}

      {/* Consent modal */}
      {consentFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setConsentFor(null)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative w-full max-w-[360px] bg-white rounded-3xl p-6 pop-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setConsentFor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Share your details with {consentFor.name}?</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Your contact details are only shared with your explicit consent, for this
              specific purpose — helping you get started with {consentFor.name}. You can
              opt out anytime.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button onClick={() => setConsentFor(null)} className="flex-1 rounded-xl py-3 font-bold text-slate-600 bg-slate-100 active:scale-[0.99] transition">
                Cancel
              </button>
              <button onClick={confirmConsent} className="flex-1 rounded-xl py-3 font-bold text-white bg-brand-600 active:scale-[0.99] transition inline-flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkle() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-600 bg-amber-50 ring-1 ring-amber-200 rounded-full px-2 py-0.5">
      ✦ Recommended for you
    </span>
  );
}
