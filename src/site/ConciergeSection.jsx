import { motion } from 'framer-motion';
import { CalendarClock, Home, GraduationCap, ShieldCheck, MessageCircle, UserRound, ArrowRight } from 'lucide-react';

const CAPS = [
  { icon: UserRound, title: 'A dedicated advisor', body: 'One named person owns your whole move — not a call centre.' },
  { icon: CalendarClock, title: 'Appointments booked for you', body: 'Medical, Emirates ID and RTA slots, held and confirmed.' },
  { icon: Home, title: 'Housing shortlist & viewings', body: 'Curated homes; your advisor coordinates the viewings.' },
  { icon: GraduationCap, title: 'School applications', body: 'Applications and assessments handled for your children.' },
  { icon: ShieldCheck, title: 'Document error-proofing', body: 'Every file checked before you submit — no rejected trips.' },
  { icon: MessageCircle, title: 'Priority same-day support', body: 'Message your advisor, average reply in 12 minutes.' },
];

export function ConciergeSection({ onLaunch }) {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 text-xs font-bold text-brand-200 mb-4">
            Concierge · AED 499
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">A real person runs the errands.</h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto">
            Plus does your paperwork. Concierge sends someone to do the running around — and in this demo, every part of it actually works.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-5 backdrop-blur"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-500/20 text-brand-200 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-lg">{c.title}</div>
                <div className="text-sm text-slate-300 mt-1">{c.body}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onLaunch('concierge')}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-extrabold px-7 py-4 shadow-xl shadow-brand-900/40 active:scale-[0.98] transition"
          >
            Experience concierge live <ArrowRight className="w-5 h-5" />
          </button>
          <div className="mt-3 text-xs text-slate-400">Opens the interactive prototype on the concierge screen.</div>
        </div>
      </div>
    </section>
  );
}
