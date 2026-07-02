import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TopBar } from '../components/PhoneFrame.jsx';
import {
  Check, CalendarClock, Home, GraduationCap, ShieldCheck, MessageCircle,
  Sparkles, Zap, X, Send, Clock, MapPin, ArrowRight,
} from 'lucide-react';

const SERVICES = [
  { id: 'medical', name: 'Medical Fitness Test', portal: 'DHA', icon: '🩺' },
  { id: 'eid', name: 'Emirates ID Biometrics', portal: 'ICP', icon: '🆔' },
  { id: 'rta', name: 'Driving Licence', portal: 'RTA', icon: '🚗' },
];
const SLOTS = ['Tomorrow · 09:00', 'Tomorrow · 14:30', 'Wed · 11:00', 'Thu · 16:00'];

const PROPERTIES = [
  { id: 'p1', title: '2BR · Dubai Marina', price: 'AED 120k/yr', meta: 'Sea view · chiller free' },
  { id: 'p2', title: '1BR · JLT', price: 'AED 85k/yr', meta: 'Metro 4 min · furnished' },
  { id: 'p3', title: '2BR · Business Bay', price: 'AED 110k/yr', meta: 'Canal view · gym' },
];

const SCHOOLS = [
  { id: 's1', name: 'GEMS Wellington', meta: 'British curriculum · Outstanding' },
  { id: 's2', name: 'Dubai British School', meta: 'FS2–Y13 · Emirates Hills' },
];

const DOCS = [
  { id: 'd1', name: 'Passport + visa page', ok: true },
  { id: 'd2', name: 'Emirates ID (front & back)', ok: true },
  { id: 'd3', name: 'Tenancy contract', ok: false, issue: 'Missing landlord signature on page 2' },
  { id: 'd4', name: 'Salary certificate', ok: true },
];

const ALACARTE = [
  { id: 'appts', label: 'Book my appointments', price: 'AED 149' },
  { id: 'school', label: 'School application help', price: 'AED 299' },
];

const QUICK_REPLIES = [
  'What should I do first?',
  'Can you book my medical test?',
  'How much deposit will I need?',
];
const ADVISOR_ANSWERS = {
  'What should I do first?': "You're all set on visa & ID. Next is your bank account — I can pre-fill the forms and book a branch slot for you.",
  'Can you book my medical test?': "Done — I'll hold Tomorrow 09:00 at DHA Al Barsha. Tap ‘Book for me’ under appointments to confirm.",
  'How much deposit will I need?': 'For a 2BR in Marina, budget ~AED 6k security deposit + 5% agency. I can run the full 3-month calculator for you.',
};

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="sticky bottom-3 z-40 mx-auto w-fit max-w-[90%] pop-in">
      <div className="flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 shadow-xl">
        <Check className="w-4 h-4 text-brand-300" /> {msg}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children, tint = 'brand' }) {
  const tints = { brand: 'bg-brand-50 text-brand-600', amber: 'bg-amber-50 text-amber-600', slate: 'bg-slate-100 text-slate-600' };
  return (
    <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tints[tint]}`}><Icon className="w-5 h-5" /></div>
        <div>
          <div className="font-extrabold text-slate-900 leading-tight">{title}</div>
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function Concierge() {
  const { goBack, answers } = useApp();
  const hasKids = answers.family === 'Family with children';

  const [toast, setToast] = useState('');
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  // Advisor chat
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'advisor', text: "Hi, I'm Rania — your Ahlan concierge. I'll handle the errands and paperwork. What can I take off your plate?" },
  ]);
  const sendReply = (q) => {
    setMessages((m) => [...m, { from: 'you', text: q }, { from: 'advisor', text: ADVISOR_ANSWERS[q] || "On it — I'll sort this and update you today." }]);
  };

  // Appointments
  const [bookingService, setBookingService] = useState(null);
  const [bookings, setBookings] = useState([]);
  const confirmBooking = (slot) => {
    setBookings((b) => [...b, { service: bookingService, slot }]);
    const svc = SERVICES.find((s) => s.id === bookingService);
    setBookingService(null);
    flash(`${svc.name} booked · ${slot}`);
  };

  // Housing viewings
  const [viewings, setViewings] = useState(new Set());
  const bookViewing = (id) => {
    setViewings((v) => new Set(v).add(id));
    flash('Viewing scheduled — Rania will meet you there');
  };

  // School
  const [schoolDone, setSchoolDone] = useState(false);

  // Doc error-proofing
  const [docsChecked, setDocsChecked] = useState(false);
  const [docsFixed, setDocsFixed] = useState(false);

  // À la carte
  const [purchased, setPurchased] = useState(new Set());
  const [purchaseItem, setPurchaseItem] = useState(null);
  const confirmPurchase = () => {
    setPurchased((p) => new Set(p).add(purchaseItem.id));
    const label = purchaseItem.label;
    setPurchaseItem(null);
    flash(`${label} — purchased`);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <TopBar title="Concierge" onBack={goBack} right={<span className="text-[10px] font-extrabold uppercase text-brand-700 bg-brand-100 rounded-full px-2 py-1">AED 499</span>} />

      <div className="px-5 py-5 space-y-4 screen-in">
        {/* Advisor header */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center text-2xl">👩🏽‍💼</div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-100">Your dedicated advisor</div>
              <div className="text-xl font-extrabold">Rania Kassab</div>
              <div className="text-sm text-brand-50/85 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-300" /> Priority · avg reply 12 min</div>
            </div>
          </div>
          <button onClick={() => setChatOpen(true)} className="mt-4 w-full rounded-2xl bg-white text-brand-700 font-extrabold py-3 flex items-center justify-center gap-2 active:scale-[0.99] transition">
            <MessageCircle className="w-4 h-4" /> Message Rania
          </button>
        </div>

        {/* Appointments */}
        <SectionCard icon={CalendarClock} title="Appointment booking" subtitle="We book medical, Emirates ID & RTA for you">
          <div className="space-y-2">
            {SERVICES.map((s) => {
              const booked = bookings.find((b) => b.service === s.id);
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                  <span className="text-lg">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{s.name}</div>
                    <div className="text-xs text-slate-500">{booked ? booked.slot : `${s.portal} · pick a slot`}</div>
                  </div>
                  {booked ? (
                    <span className="text-xs font-extrabold text-brand-600 inline-flex items-center gap-1"><Check className="w-4 h-4" /> Booked</span>
                  ) : (
                    <button onClick={() => setBookingService(s.id)} className="text-xs font-extrabold text-white bg-brand-600 rounded-xl px-3 py-2 active:scale-95 transition">Book for me</button>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Housing */}
        <SectionCard icon={Home} title="Housing shortlist & viewings" subtitle="Curated by your advisor — book a viewing in a tap">
          <div className="space-y-2">
            {PROPERTIES.map((p) => {
              const booked = viewings.has(p.id);
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{p.title} · {p.price}</div>
                    <div className="text-xs text-slate-500 truncate">{p.meta}</div>
                  </div>
                  {booked ? (
                    <span className="text-xs font-extrabold text-brand-600 inline-flex items-center gap-1"><Check className="w-4 h-4" /> Viewing set</span>
                  ) : (
                    <button onClick={() => bookViewing(p.id)} className="text-xs font-extrabold text-brand-700 bg-brand-100 rounded-xl px-3 py-2 active:scale-95 transition">Book viewing</button>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* School (families) */}
        {hasKids && (
          <SectionCard icon={GraduationCap} title="School application assistance" subtitle="We handle applications & assessments">
            {schoolDone ? (
              <div className="rounded-2xl bg-brand-50 ring-1 ring-brand-100 p-3 text-sm text-brand-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600" /> Applications submitted to {SCHOOLS.map((s) => s.name).join(' & ')}. Rania is tracking assessments.
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-3">
                  {SCHOOLS.map((s) => (
                    <div key={s.id} className="rounded-2xl bg-slate-50 px-3 py-2.5">
                      <div className="text-sm font-bold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.meta}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setSchoolDone(true); flash('School applications started by Rania'); }} className="w-full rounded-2xl bg-brand-600 text-white font-bold py-2.5 active:scale-[0.99] transition">
                  Start applications for me
                </button>
              </>
            )}
          </SectionCard>
        )}

        {/* Document error-proofing */}
        <SectionCard icon={ShieldCheck} title="Document error-proofing" subtitle="We check every file before you submit" tint={docsFixed ? 'brand' : 'amber'}>
          {!docsChecked ? (
            <button onClick={() => setDocsChecked(true)} className="w-full rounded-2xl bg-slate-900 text-white font-bold py-2.5 active:scale-[0.99] transition">
              Run pre-submission check
            </button>
          ) : (
            <div className="space-y-2">
              {DOCS.map((d) => {
                const resolved = d.ok || docsFixed;
                return (
                  <div key={d.id} className="flex items-center gap-2.5 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${resolved ? 'bg-brand-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {resolved ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '!'}
                    </span>
                    <span className={resolved ? 'text-slate-600' : 'text-amber-800 font-semibold'}>
                      {d.name}{!resolved && d.issue ? ` — ${d.issue}` : ''}
                    </span>
                  </div>
                );
              })}
              {!docsFixed ? (
                <button onClick={() => { setDocsFixed(true); flash('Document fixed & re-checked — all clear'); }} className="mt-1 w-full rounded-2xl bg-amber-500 text-white font-bold py-2.5 active:scale-[0.99] transition">
                  Fix & re-check
                </button>
              ) : (
                <div className="mt-1 rounded-2xl bg-brand-50 ring-1 ring-brand-100 p-2.5 text-sm text-brand-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600" /> All documents error-proofed
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* À la carte */}
        <div>
          <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-2.5">Add à la carte</div>
          <div className="space-y-2">
            {ALACARTE.map((a) => {
              const bought = purchased.has(a.id);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-slate-200 px-4 py-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex-1 font-bold text-slate-800 text-sm">{a.label}</div>
                  {bought ? (
                    <span className="text-xs font-extrabold text-brand-600 inline-flex items-center gap-1"><Check className="w-4 h-4" /> Added</span>
                  ) : (
                    <button onClick={() => setPurchaseItem(a)} className="text-xs font-extrabold text-white bg-slate-900 rounded-xl px-3 py-2 active:scale-95 transition">{a.price}</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Toast msg={toast} />

      {/* Slot picker sheet */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setBookingService(null)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative w-full bg-white rounded-t-3xl p-5 pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-extrabold text-slate-900">Pick a slot</h3>
              <button onClick={() => setBookingService(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">{SERVICES.find((s) => s.id === bookingService)?.name} · Rania will handle the rest.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {SLOTS.map((slot) => (
                <button key={slot} onClick={() => confirmBooking(slot)} className="rounded-2xl bg-slate-50 hover:bg-brand-50 ring-1 ring-slate-200 hover:ring-brand-300 px-3 py-3 text-sm font-bold text-slate-800 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition">
                  <Clock className="w-4 h-4 text-brand-600" /> {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Purchase confirm */}
      {purchaseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setPurchaseItem(null)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative w-full max-w-[340px] bg-white rounded-3xl p-6 pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3"><Sparkles className="w-6 h-6" /></div>
            <h3 className="text-lg font-extrabold text-slate-900">{purchaseItem.label}</h3>
            <p className="text-sm text-slate-500 mt-1">Confirm a one-time charge of <span className="font-bold text-slate-700">{purchaseItem.price}</span>. Your advisor starts immediately.</p>
            <div className="mt-5 flex gap-2.5">
              <button onClick={() => setPurchaseItem(null)} className="flex-1 rounded-xl py-3 font-bold text-slate-600 bg-slate-100 active:scale-[0.99] transition">Cancel</button>
              <button onClick={confirmPurchase} className="flex-1 rounded-xl py-3 font-bold text-white bg-brand-600 active:scale-[0.99] transition inline-flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Advisor chat sheet */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setChatOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative w-full bg-white rounded-t-3xl pop-in flex flex-col max-h-[85%]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl">👩🏽‍💼</div>
              <div className="flex-1">
                <div className="font-extrabold text-slate-900 leading-tight">Rania Kassab</div>
                <div className="text-xs text-brand-600 font-semibold">● Online · Priority support</div>
              </div>
              <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === 'you' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <div className="flex flex-wrap gap-2 mb-2">
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => sendReply(q)} className="text-xs font-semibold text-brand-700 bg-brand-50 ring-1 ring-brand-100 rounded-full px-3 py-1.5 active:scale-95 transition">{q}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2">
                <input readOnly placeholder="Tap a quick question above…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
                <Send className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
