import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppProvider, useApp } from '../context/AppContext.jsx';
import { PrototypeShell } from '../PrototypeShell.jsx';
import { PhoneViewport } from '../components/PhoneViewport.jsx';
import { Maximize2, Hand } from 'lucide-react';

const CHIPS = [
  { label: 'Welcome', screen: 'welcome' },
  { label: 'Questionnaire', screen: 'questionnaire' },
  { label: 'Roadmap', screen: 'roadmap' },
  { label: 'Step detail', step: 'bank_account' },
  { label: 'Pricing', screen: 'tiers' },
  { label: 'Cost calculator', screen: 'calculator' },
  { label: 'Concierge', screen: 'concierge' },
  { label: 'Employer', screen: 'employer' },
];

function ChipDriver({ target }) {
  const { gotoScreen, previewStep } = useApp();
  useEffect(() => {
    if (!target) return;
    if (target.step) previewStep(target.step);
    else gotoScreen(target.screen);
  }, [target, gotoScreen, previewStep]);
  return null;
}

export function TryIt({ onLaunch }) {
  const [target, setTarget] = useState(null);
  const [active, setActive] = useState('Welcome');

  const jump = (chip) => {
    setActive(chip.label);
    setTarget({ ...chip, nonce: Date.now() });
  };

  return (
    <section className="relative py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600">The product</div>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-slate-900">Try it yourself — every button works.</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            This is the real prototype, running live. Tap through it right here, or jump to any screen.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14">
          {/* Controls */}
          <div className="w-full lg:w-72 order-2 lg:order-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5" /> Jump to a screen
            </div>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => jump(c)}
                  className={`text-sm font-bold rounded-full px-3.5 py-2 transition active:scale-95 ${
                    active === c.label ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              onClick={onLaunch}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white font-bold px-5 py-3 active:scale-[0.98] transition"
            >
              <Maximize2 className="w-4 h-4" /> Open full screen
            </button>
            <p className="mt-3 text-xs text-slate-400">Tip: the phone is fully interactive — tap the buttons inside it too.</p>
          </div>

          {/* Interactive phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 shrink-0 scale-[0.7] sm:scale-[0.82] lg:scale-90 origin-top"
          >
            <AppProvider previewMode initialScreen="welcome">
              <ChipDriver target={target} />
              <PhoneViewport interactive glow>
                <PrototypeShell />
              </PhoneViewport>
            </AppProvider>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
