import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { AppProvider, useApp } from '../context/AppContext.jsx';
import { PrototypeShell } from '../PrototypeShell.jsx';
import { PhoneViewport } from '../components/PhoneViewport.jsx';
import { Play } from 'lucide-react';

const FRAMES = [
  { key: 'welcome', title: 'Welcome', desc: 'Two doors — individual or employer. Ahlan adapts to whichever you pick.' },
  { key: 'questionnaire', title: 'Six quick questions', desc: 'Family, visa, emirate, housing, driving, and whether your PRO handled the visa.' },
  { key: 'generating', title: 'Generating your roadmap', desc: 'Ahlan maps dependencies and orders every step for your exact situation.' },
  { key: 'roadmap', title: 'Your personalized timeline', desc: 'Completed, current and locked steps — always one clear thing to do next.' },
  { key: 'stepDetail', step: 'bank_account', title: 'Every step, explained', desc: 'Documents, the right portal, processing time, and the mistake to avoid.' },
  { key: 'tiers', title: 'Plans that fit', desc: 'Free guidance, Plus does your paperwork, Concierge sends a real person.' },
  { key: 'calculator', title: 'Know the cost upfront', desc: 'A live first-3-months budget for your emirate, family size and area.' },
  { key: 'employer', title: 'Employer view', desc: 'HR sees every hire’s progress and spots who is stuck — read-only.' },
];

function Driver({ index }) {
  const { gotoScreen, previewStep } = useApp();
  useEffect(() => {
    const f = FRAMES[index];
    if (f.step) previewStep(f.step);
    else gotoScreen(f.key);
  }, [index, gotoScreen, previewStep]);
  return null;
}

export function PhoneDemo({ onLaunch }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(FRAMES.length - 1, Math.max(0, Math.floor(v * FRAMES.length)));
    setIndex(i);
  });

  const frame = FRAMES[index];

  return (
    <section ref={ref} className="relative bg-slate-50" style={{ height: '540vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14 px-6">
        {/* caption */}
        <div className="w-full lg:w-80 text-center lg:text-right order-2 lg:order-1 shrink-0">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            The product · {index + 1}/{FRAMES.length}
          </div>
          <div className="min-h-[92px]">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{frame.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-slate-500 lg:ml-auto max-w-xs">{frame.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* progress dots */}
          <div className="flex justify-center lg:justify-end gap-1.5 mt-4">
            {FRAMES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-brand-500' : 'w-1.5 bg-slate-300'}`} />
            ))}
          </div>
          <button
            onClick={onLaunch}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-600 text-white font-bold px-5 py-3 shadow-lg shadow-brand-600/25 active:scale-[0.98] transition"
          >
            <Play className="w-4 h-4" /> Launch the live prototype
          </button>
        </div>

        {/* phone */}
        <motion.div
          className="order-1 lg:order-2 shrink-0 scale-[0.5] sm:scale-[0.66] lg:scale-[0.82] origin-center"
          animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AppProvider previewMode initialScreen="welcome">
            <Driver index={index} />
            <PhoneViewport interactive={false} glow>
              <PrototypeShell />
            </PhoneViewport>
          </AppProvider>
        </motion.div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        Keep scrolling to move through the app
      </div>
    </section>
  );
}
