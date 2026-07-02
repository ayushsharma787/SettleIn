import { motion } from 'framer-motion';
import { Cloud, Plane, IndiaSkyline, DubaiSkyline } from './illustrations.jsx';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#eaf6ff] via-[#f2faf8] to-[#eef4f2]" />

      {/* floating clouds */}
      <motion.div className="absolute top-[14%] left-[-8%] text-white/90 w-40"
        animate={{ x: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>
        <Cloud />
      </motion.div>
      <motion.div className="absolute top-[26%] right-[-6%] text-white/80 w-56"
        animate={{ x: [0, -50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}>
        <Cloud />
      </motion.div>
      <motion.div className="absolute top-[44%] left-[12%] text-white/70 w-28"
        animate={{ x: [0, 24, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}>
        <Cloud />
      </motion.div>

      {/* copy */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur ring-1 ring-brand-200 px-3.5 py-1.5 text-xs font-bold text-brand-700 mb-6"
        >
          <span className="font-arabic text-base leading-none">أهلاً</span> · Ahlan — your welcome to the UAE
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.1rem] sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] max-w-3xl"
        >
          Moving countries shouldn't feel harder than moving homes.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-5 text-base sm:text-xl text-slate-500 max-w-xl"
        >
          Every year thousands move to the UAE — and nobody tells them the correct order.
        </motion.p>
      </div>

      {/* plane idle */}
      <motion.div
        className="absolute z-10 left-1/2 -translate-x-1/2 top-[60%] w-48 sm:w-64 text-brand-600"
        animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Plane />
      </motion.div>

      {/* skylines */}
      <div className="relative z-[5] w-full">
        <div className="flex items-end justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }} className="w-1/2 max-w-xs">
            <IndiaSkyline className="w-full" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }} className="w-1/2 max-w-xs">
            <DubaiSkyline className="w-full" />
          </motion.div>
        </div>
        <div className="h-3 bg-gradient-to-r from-[#e6a23c]/30 via-slate-200 to-brand-500/30" />
      </div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-slate-400"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest mb-1">Scroll to travel with Priya</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
