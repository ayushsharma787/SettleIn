import { motion } from 'framer-motion';
import { DubaiSkyline, PriyaWithKeys } from './illustrations.jsx';
import { Logo } from '../components/Logo.jsx';
import { ArrowRight, Play } from 'lucide-react';

export function Finale({ onLaunch, onWatch }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 to-white">
      {/* skyline backdrop */}
      <div className="absolute bottom-0 inset-x-0 opacity-40">
        <DubaiSkyline className="w-full max-w-3xl mx-auto" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="w-40 mx-auto mb-6"
        >
          <PriyaWithKeys className="w-full" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]"
        >
          You didn't just move.<br />
          <span className="text-brand-600">You arrived.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 flex flex-col items-center"
        >
          <Logo size="lg" />
          <p className="mt-4 text-lg text-slate-500">From six weeks of chaos to six hours of clarity.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button onClick={onLaunch} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white font-extrabold px-7 py-4 shadow-lg shadow-brand-600/25 active:scale-[0.98] transition">
            Get started <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={onWatch} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-800 font-extrabold px-7 py-4 ring-1 ring-slate-200 active:scale-[0.98] transition">
            <Play className="w-5 h-5 text-brand-600" /> Watch demo
          </button>
        </motion.div>

        <div className="mt-16 text-xs text-slate-400">
          Ahlan · أهلاً — an onboarding companion for expats moving to the UAE. Demo build · sample data.
        </div>
      </div>
    </section>
  );
}
