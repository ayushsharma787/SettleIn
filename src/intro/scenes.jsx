// Shared visual building blocks for the IntroStory scroll sequence.
// Everything is flat/geometric SVG + Tailwind in the existing Ahlan palette
// (brand teal, warm amber, white) — no video or Lottie assets.
import { Icon } from '../components/Icon.jsx';

// ---------------------------------------------------------------------------
// Traveler — simple geometric character with a rolling suitcase.
// Matches the flat style of PriyaWithKeys in src/site/illustrations.jsx.
// ---------------------------------------------------------------------------
export function Traveler({ className = '', style }) {
  return (
    <svg viewBox="0 0 170 240" className={className} style={style} fill="none" aria-hidden>
      {/* legs */}
      <path d="M78 176 v42" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" />
      <path d="M100 176 v42" stroke="#334155" strokeWidth="13" strokeLinecap="round" />
      {/* body */}
      <rect x="60" y="104" width="58" height="82" rx="24" fill="#0d8b78" />
      {/* satchel strap */}
      <path d="M64 116 L112 168" stroke="#dfae41" strokeWidth="7" strokeLinecap="round" />
      {/* head */}
      <circle cx="89" cy="74" r="24" fill="#e8b98f" />
      <path d="M65 70 a24 24 0 0 1 48 0 v-4 q-24 -18 -48 0 z" fill="#3f2a1e" />
      <circle cx="97" cy="74" r="2.6" fill="#1e293b" />
      <path d="M96 84 q5 3 9 0" stroke="#b2743d" strokeWidth="2.5" strokeLinecap="round" />
      {/* arm holding suitcase handle */}
      <path d="M64 122 q-18 18 -20 44" stroke="#e8b98f" strokeWidth="10" strokeLinecap="round" />
      {/* suitcase */}
      <g>
        <path d="M42 168 v-8" stroke="#b26f18" strokeWidth="5" strokeLinecap="round" />
        <rect x="24" y="166" width="38" height="52" rx="8" fill="#dfae41" />
        <rect x="24" y="184" width="38" height="6" fill="#c9821f" />
        <circle cx="34" cy="222" r="5" fill="#334155" />
        <circle cx="52" cy="222" r="5" fill="#334155" />
      </g>
    </svg>
  );
}

// Right-facing plane (the site's Plane faces left) with landing gear, so it
// can taxi, take off and land left→right across the story.
export function StoryPlane({ className = '', style }) {
  return (
    <svg viewBox="0 0 240 120" className={className} style={style} fill="none" aria-hidden>
      {/* contrail behind the tail */}
      <path d="M4 64 C34 62 52 61 74 60" stroke="currentColor" strokeOpacity="0.18" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 16" />
      {/* tail fin */}
      <path d="M78 62 L60 28 L80 30 L98 58 Z" fill="#17a892" />
      {/* fuselage — tail left, rounded nose right */}
      <path d="M70 58 L192 50 C208 50 224 56 224 61 C224 66 208 72 192 72 L70 64 C62 64 62 59 70 58 Z" fill="#0e6f62" />
      {/* rear stabilizer */}
      <path d="M86 63 L64 82 L82 81 L100 64 Z" fill="#0d8b78" />
      {/* wings */}
      <path d="M126 64 L102 96 L120 96 L152 66 Z" fill="#0d8b78" />
      <path d="M132 53 L114 30 L128 30 L154 52 Z" fill="#0d8b78" />
      {/* windows + cockpit */}
      <circle cx="152" cy="59" r="3" fill="#d3f5ec" />
      <circle cx="166" cy="59" r="3" fill="#d3f5ec" />
      <circle cx="180" cy="59" r="3" fill="#d3f5ec" />
      <path d="M204 57 h14" stroke="#75d7c4" strokeWidth="4" strokeLinecap="round" />
      {/* landing gear */}
      <circle cx="118" cy="78" r="5" fill="#334155" />
      <circle cx="196" cy="77" r="5" fill="#334155" />
    </svg>
  );
}

// Small sun disc used in the India scene; sets while flying to Dubai.
export function Sun({ className = '', style }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <circle cx="50" cy="50" r="26" fill="#f2c46d" />
      <circle cx="50" cy="50" r="36" fill="#f2c46d" fillOpacity="0.25" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Paperwork chips — the checklist items that swarm in around the traveler
// (scene 3) and then consolidate into the roadmap phone (scene 4).
// Mirrors real steps from src/data/steps.js.
// ---------------------------------------------------------------------------
export const CHIPS = [
  { id: 'medical', label: 'Medical test', icon: 'stethoscope' },
  { id: 'eid', label: 'Emirates ID', icon: 'fingerprint' },
  { id: 'visa', label: 'Residence visa', icon: 'stamp' },
  { id: 'bank', label: 'Bank account', icon: 'bank' },
  { id: 'ejari', label: 'Tenancy · Ejari', icon: 'contract' },
  { id: 'dewa', label: 'Utilities', icon: 'bolt' },
];

// Scattered resting positions (percent of the stage), slightly chaotic on
// purpose — they echo the "chaos" the app tidies up. Right-hand chips anchor
// with `right` so they can never overflow the viewport on small screens, and
// every spot sits clear of the headline zone and the centred traveler.
export const CHIP_SPOTS = [
  { left: '8%', top: '30%', rotate: -8 },
  { right: '6%', top: '32%', rotate: 6 },
  { left: '4%', top: '52%', rotate: 5 },
  { right: '5%', top: '50%', rotate: -5 },
  { left: '12%', top: '74%', rotate: 7 },
  { right: '10%', top: '72%', rotate: -7 },
];

export function Chip({ chip, className = '', style }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-slate-200 shadow-lg shadow-slate-900/5 pl-1.5 pr-3.5 py-1.5 ${className}`}
      style={style}
    >
      <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon name={chip.icon} className="w-3.5 h-3.5" />
      </span>
      <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">{chip.label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MiniRoadmapPhone — a stylized, non-interactive preview of the app's
// Roadmap screen (Screen 3). GSAP targets the ip-* class hooks.
// ---------------------------------------------------------------------------
const PHONE_ROWS = CHIPS.slice(0, 5);

export function MiniRoadmapPhone({ className = '', style, staticDone = false }) {
  return (
    <div
      className={`w-60 sm:w-64 rounded-[2rem] bg-slate-900 p-2 shadow-2xl shadow-brand-900/30 ${className}`}
      style={style}
      aria-hidden
    >
      <div className="rounded-[1.6rem] bg-white overflow-hidden">
        {/* notch */}
        <div className="flex justify-center pt-1.5">
          <div className="w-16 h-1.5 rounded-full bg-slate-200" />
        </div>
        {/* header */}
        <div className="px-4 pt-2.5 pb-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-arabic text-base shrink-0">
            أ
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-extrabold text-slate-900">Your roadmap</div>
            <div className="text-[10px] text-slate-400 font-semibold">Employment · Dubai</div>
          </div>
        </div>
        {/* progress */}
        <div className="px-4">
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="ip-fill h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              style={{ width: staticDone ? '60%' : '8%' }}
            />
          </div>
        </div>
        {/* rows */}
        <div className="px-3.5 py-3.5 space-y-2">
          {PHONE_ROWS.map((row, i) => (
            <div
              key={row.id}
              className="ip-row flex items-center gap-2.5 rounded-xl ring-1 ring-slate-100 bg-white px-2.5 py-2"
            >
              <span
                className={`ip-dot w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  staticDone && i < 3 ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'
                }`}
              >
                {staticDone && i < 3 ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : (
                  <Icon name={row.icon} className="w-3 h-3" />
                )}
              </span>
              <span className="text-[11px] font-bold text-slate-700">{row.label}</span>
              {(!staticDone || i < 3) && (
                <span className="ip-check ml-auto w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
