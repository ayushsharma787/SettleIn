import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppProvider } from '../context/AppContext.jsx';
import { PrototypeShell } from '../PrototypeShell.jsx';
import { PhoneViewport } from '../components/PhoneViewport.jsx';
import { X } from 'lucide-react';

export function LiveOverlay({ onClose, initialScreen = 'welcome' }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm px-4"
      onClick={onClose}
      data-testid="live-overlay"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition"
        aria-label="Close prototype"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="absolute top-6 left-5 text-white/90 text-sm font-bold">
        Live prototype · fully interactive
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="scale-[0.82] sm:scale-90 md:scale-100 origin-center"
      >
        <AppProvider initialScreen={initialScreen}>
          <PhoneViewport interactive>
            <PrototypeShell />
          </PhoneViewport>
        </AppProvider>
      </motion.div>
    </motion.div>
  );
}
