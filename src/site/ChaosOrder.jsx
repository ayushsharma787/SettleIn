import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Logo } from '../components/Logo.jsx';

const CARDS = [
  { label: 'Medical Fitness', emoji: '🩺', chaos: { x: 18, y: 22, r: -14 } },
  { label: 'Emirates ID', emoji: '🆔', chaos: { x: 74, y: 16, r: 12 } },
  { label: 'Residence Visa', emoji: '📄', chaos: { x: 40, y: 12, r: -6 } },
  { label: 'Bank Account', emoji: '🏦', chaos: { x: 84, y: 44, r: -18 } },
  { label: 'Housing', emoji: '🏠', chaos: { x: 12, y: 52, r: 16 } },
  { label: 'DEWA', emoji: '⚡', chaos: { x: 62, y: 62, r: -10 } },
  { label: 'Internet', emoji: '📶', chaos: { x: 30, y: 74, r: 14 } },
  { label: 'Insurance', emoji: '❤️', chaos: { x: 82, y: 78, r: -8 } },
  { label: 'Driving License', emoji: '🚗', chaos: { x: 20, y: 88, r: 10 } },
];

function Card({ card, i, progress }) {
  const orderX = 50;
  const orderY = 12 + i * 9;
  const x = useTransform(progress, [0.18, 0.55], [card.chaos.x, orderX]);
  const y = useTransform(progress, [0.18, 0.55], [card.chaos.y, orderY]);
  const r = useTransform(progress, [0.18, 0.55], [card.chaos.r, 0]);
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);
  const check = useTransform(progress, [0.56, 0.62], [0, 1]);

  return (
    <motion.div
      style={{ left, top, rotate: r, x: '-50%', y: '-50%' }}
      className="absolute w-[150px] sm:w-[180px]"
    >
      <div className="flex items-center gap-2.5 rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg shadow-slate-300/30 px-3.5 py-2.5">
        <span className="text-lg leading-none">{card.emoji}</span>
        <span className="text-sm font-bold text-slate-800 truncate">{card.label}</span>
        <motion.span style={{ scale: check }} className="ml-auto w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </motion.span>
      </div>
    </motion.div>
  );
}

function Noise({ progress }) {
  const opacity = useTransform(progress, [0.1, 0.4], [1, 0]);
  const items = [
    { t: '?', x: '8%', y: '30%', s: 'text-4xl' },
    { t: '?', x: '90%', y: '24%', s: 'text-3xl' },
    { t: '?', x: '52%', y: '84%', s: 'text-5xl' },
    { t: '!', x: '68%', y: '34%', s: 'text-3xl' },
    { t: '?', x: '24%', y: '64%', s: 'text-4xl' },
  ];
  return (
    <>
      {items.map((it, i) => (
        <motion.div key={i} style={{ opacity, left: it.x, top: it.y }}
          className={`absolute ${it.s} font-black text-amber-400/70`}
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          {it.t}
        </motion.div>
      ))}
    </>
  );
}

export function ChaosOrder() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const chaosHeadline = useTransform(scrollYProgress, [0.28, 0.44], [1, 0]);
  const orderHeadline = useTransform(scrollYProgress, [0.5, 0.64], [0, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-white to-brand-50/40" style={{ height: '340vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* headlines */}
        <div className="relative z-20 pt-16 px-6 text-center h-40">
          <motion.h2 style={{ opacity: chaosHeadline }} className="absolute inset-x-0 top-16 text-3xl sm:text-5xl font-extrabold text-slate-900 px-6">
            Nobody tells you<br />what comes first.
          </motion.h2>
          <motion.div style={{ opacity: orderHeadline }} className="absolute inset-x-0 top-16 px-6">
            <div style={{ opacity: logoOpacity ? 1 : 1 }} className="flex justify-center mb-3">
              <motion.div style={{ opacity: logoOpacity }}><Logo size="md" /></motion.div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Ahlan creates the roadmap.</h2>
          </motion.div>
        </div>

        {/* stage */}
        <div className="relative flex-1 max-w-2xl w-full mx-auto">
          <Noise progress={scrollYProgress} />
          {CARDS.map((c, i) => (
            <Card key={c.label} card={c} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
