import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext.jsx';
import { PrototypeShell } from './PrototypeShell.jsx';
import { PhoneViewport } from './components/PhoneViewport.jsx';
import { IntroStory } from './intro/IntroStory.jsx';

// Scroll-driven storytelling intro that plays before the app.
// Set to false (or delete src/intro/) to ship without it — see src/intro/README.md.
const SHOW_INTRO = true;

// The app itself: the fully interactive prototype in a phone frame, starting
// on Screen 1 (Welcome / mode select).
function AppExperience() {
  // The phone frame is the whole experience — the page itself never scrolls.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 px-4">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-6 left-5 text-white/90 text-sm font-bold">
        Live prototype · fully interactive
      </div>

      <motion.div
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        className="scale-[0.82] sm:scale-90 md:scale-100 origin-center"
      >
        <AppProvider initialScreen="welcome">
          <PhoneViewport interactive>
            <PrototypeShell />
          </PhoneViewport>
        </AppProvider>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(!SHOW_INTRO);

  const enterApp = () => {
    window.scrollTo({ top: 0 });
    setEntered(true);
  };

  return (
    <AnimatePresence mode="wait">
      {entered ? (
        <motion.div
          key="app"
          className="w-full"
          initial={SHOW_INTRO ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <AppExperience />
        </motion.div>
      ) : (
        <motion.div
          key="intro"
          className="w-full"
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }}
        >
          <IntroStory onEnter={enterApp} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
