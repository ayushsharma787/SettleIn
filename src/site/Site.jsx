import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Hero } from './Hero.jsx';
import { Journey } from './Journey.jsx';
import { ChaosOrder } from './ChaosOrder.jsx';
import { TryIt } from './TryIt.jsx';
import { ConciergeSection } from './ConciergeSection.jsx';
import { TimelineReveal } from './TimelineReveal.jsx';
import { Finale } from './Finale.jsx';
import { LiveOverlay } from './LiveOverlay.jsx';
import { Logo } from '../components/Logo.jsx';
import { Sparkles } from 'lucide-react';

// `initialLive` lets the intro sequence hand off directly into the live
// prototype (Screen 1 — Welcome / mode select) instead of the marketing page.
export function Site({ initialLive = false, initialLiveScreen = 'welcome' }) {
  const [live, setLive] = useState(initialLive);
  const [liveScreen, setLiveScreen] = useState(initialLiveScreen);
  const demoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const launch = (screen = 'welcome') => {
    setLiveScreen(screen);
    setLive(true);
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full bg-white" style={{ overflowX: 'clip' }}>
      {/* scroll progress bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600 origin-left z-[60]" />

      {/* floating brand + launch */}
      <div className="fixed top-3 left-4 z-50 hidden sm:block">
        <div className="bg-white/70 backdrop-blur rounded-full px-3 py-1.5 ring-1 ring-slate-200/70 shadow-sm">
          <Logo size="sm" />
        </div>
      </div>
      <button
        onClick={() => launch('welcome')}
        className="fixed top-3 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-bold px-4 py-2.5 shadow-lg active:scale-95 transition"
      >
        <Sparkles className="w-4 h-4 text-brand-300" /> Try the app
      </button>

      <main>
        <Hero />
        <Journey />
        <ChaosOrder />
        <div ref={demoRef}>
          <TryIt onLaunch={() => launch('welcome')} />
        </div>
        <ConciergeSection onLaunch={launch} />
        <TimelineReveal />
        <Finale onLaunch={() => launch('welcome')} onWatch={scrollToDemo} />
      </main>

      <AnimatePresence>
        {live && <LiveOverlay onClose={() => setLive(false)} initialScreen={liveScreen} />}
      </AnimatePresence>
    </div>
  );
}
