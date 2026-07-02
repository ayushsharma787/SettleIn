import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Site } from './site/Site.jsx';
import { IntroStory } from './intro/IntroStory.jsx';

// Scroll-driven storytelling intro that plays before the main experience.
// Set to false (or delete src/intro/) to ship without it — see src/intro/README.md.
const SHOW_INTRO = true;

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
          {/* Arriving from the intro lands straight on Screen 1 (Welcome / mode
              select) inside the live prototype; closing it reveals the site. */}
          <Site initialLive={SHOW_INTRO} initialLiveScreen="welcome" />
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
