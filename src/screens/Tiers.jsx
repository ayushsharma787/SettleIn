import { useApp } from '../context/AppContext.jsx';
import { TopBar } from '../components/PhoneFrame.jsx';
import { Check, Crown, Sparkles, UserRound } from 'lucide-react';

const TIERS = [
  {
    id: 'free',
    name: 'Guide',
    price: 'Free',
    tagline: 'Everything you need to navigate the journey',
    accent: 'slate',
    icon: Sparkles,
    features: [
      'Personalized, sequenced roadmap',
      'Dependency mapping & step unlocking',
      'Per-step guidance, docs & portal links',
      'Progress tracking & notifications',
      'Recommended services',
      'Renewal reminders (visa, EID, insurance)',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 'AED 99',
    priceNote: 'one-time',
    tagline: 'The app does your paperwork',
    accent: 'brand',
    featured: true,
    icon: Crown,
    features: [
      'Everything in Guide',
      'Auto-filled document packs (DEWA, Ejari, bank)',
      'Document vault & readiness checker',
      'Personalized 3-month cost calculator',
      'Side-by-side bank / insurer / area tools',
      'Regulatory update alerts',
    ],
  },
  {
    id: 'concierge',
    name: 'Concierge',
    price: 'AED 499',
    priceNote: 'one-time',
    tagline: 'A real person runs the errands',
    accent: 'amber',
    icon: UserRound,
    features: [
      'Everything in Plus',
      'Dedicated named advisor',
      'Appointment booking done for you',
      'Housing shortlist & viewing coordination',
      'School application assistance (families)',
      'Document error-proofing + priority support',
    ],
    alacarte: ['Book my appointments — AED 149', 'School application help — AED 299'],
  },
];

export function Tiers() {
  const { goBack, navigate } = useApp();
  const openTier = (id) => {
    if (id === 'concierge') navigate('concierge');
    else if (id === 'plus') navigate('calculator');
  };
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <TopBar title="Plans" onBack={goBack} />
      <div className="px-5 py-5 screen-in">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900">Choose how far you go</h2>
          <p className="text-sm text-slate-500 mt-1">Free forever. Upgrade only if you want the work done for you.</p>
        </div>

        <div className="space-y-4">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const featured = t.featured;
            return (
              <div
                key={t.id}
                className={`rounded-3xl p-5 relative ${
                  featured
                    ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-xl shadow-brand-600/25 ring-1 ring-brand-500'
                    : 'bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm'
                }`}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    featured ? 'bg-white/15 text-amber-300' : t.accent === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-lg">{t.name}</div>
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  <div className="text-3xl font-extrabold">{t.price}</div>
                  {t.priceNote && <div className={`text-sm mb-1 ${featured ? 'text-brand-100' : 'text-slate-400'}`}>{t.priceNote}</div>}
                </div>
                <div className={`text-sm font-semibold mt-1 ${featured ? 'text-brand-50' : 'text-brand-700'}`}>{t.tagline}</div>

                <div className="mt-4 space-y-2">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        featured ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'
                      }`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className={`text-sm ${featured ? 'text-brand-50' : 'text-slate-600'}`}>{f}</span>
                    </div>
                  ))}
                </div>

                {t.alacarte && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Also à la carte</div>
                    <div className="space-y-1.5">
                      {t.alacarte.map((a) => (
                        <button key={a} onClick={() => navigate('concierge')} className="w-full text-left text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg px-3 py-2 active:scale-[0.99] transition">{a}</button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => openTier(t.id)}
                  className={`mt-5 w-full rounded-2xl py-3 font-extrabold active:scale-[0.99] transition ${
                    featured ? 'bg-white text-brand-700' : t.id === 'free' ? 'bg-slate-900 text-white' : 'bg-brand-600 text-white'
                  }`}
                >
                  {t.id === 'free' ? 'Your current plan' : `Get ${t.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
