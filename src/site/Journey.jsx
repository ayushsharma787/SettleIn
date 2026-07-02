import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cloud, Plane, IndiaSkyline, DubaiSkyline, PassportStamp } from './illustrations.jsx';
import { Logo } from '../components/Logo.jsx';

export function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Plane travels up-and-across, then descends toward Dubai
  const planeX = useTransform(scrollYProgress, [0, 0.55, 1], ['-30%', '25%', '70%']);
  const planeY = useTransform(scrollYProgress, [0, 0.5, 1], ['20%', '-40%', '10%']);
  const planeRotate = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [-8, -14, 2, 6]);

  const indiaOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const indiaY = useTransform(scrollYProgress, [0, 0.4], ['0%', '40%']);

  const dubaiOpacity = useTransform(scrollYProgress, [0.45, 0.8], [0, 1]);
  const dubaiScale = useTransform(scrollYProgress, [0.45, 1], [0.7, 1.05]);
  const dubaiY = useTransform(scrollYProgress, [0.45, 1], ['30%', '0%']);

  const cloud1 = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const cloud2 = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const skyHue = useTransform(scrollYProgress, [0, 0.5, 1], ['#eaf6ff', '#dff1ee', '#eafaf5']);

  const arrivalOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const arrivalScale = useTransform(scrollYProgress, [0.72, 0.92], [0.85, 1]);
  const stampOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const stampRotate = useTransform(scrollYProgress, [0.8, 0.95], [-25, -12]);

  const label = useTransform(scrollYProgress, [0, 0.5, 0.75], ['Leaving India…', 'Somewhere over the Arabian Sea…', 'Descending into Dubai…']);

  return (
    <section ref={ref} className="relative" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ backgroundColor: skyHue }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40" />

        {/* clouds parallax */}
        <motion.div style={{ x: cloud1 }} className="absolute top-[18%] left-[10%] text-white w-48 opacity-90"><Cloud /></motion.div>
        <motion.div style={{ x: cloud2 }} className="absolute top-[30%] right-[8%] text-white w-64 opacity-80"><Cloud /></motion.div>
        <motion.div style={{ x: cloud1 }} className="absolute top-[58%] left-[24%] text-white w-36 opacity-70"><Cloud /></motion.div>

        {/* travel label */}
        <motion.div className="absolute top-24 left-1/2 -translate-x-1/2 text-sm font-bold text-brand-700 bg-white/70 backdrop-blur rounded-full px-4 py-1.5 ring-1 ring-brand-100">
          {label}
        </motion.div>

        {/* plane */}
        <motion.div className="absolute left-1/2 top-1/2 w-56 sm:w-80 text-brand-600 z-20"
          style={{ x: planeX, y: planeY, rotate: planeRotate }}>
          <Plane />
        </motion.div>

        {/* India leaving */}
        <motion.div style={{ opacity: indiaOpacity, y: indiaY }} className="absolute bottom-0 left-0 w-1/2 max-w-sm">
          <IndiaSkyline className="w-full" />
        </motion.div>

        {/* Dubai arriving */}
        <motion.div style={{ opacity: dubaiOpacity, scale: dubaiScale, y: dubaiY }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl origin-bottom">
          <DubaiSkyline className="w-full" />
        </motion.div>

        {/* Arrival card */}
        <motion.div style={{ opacity: arrivalOpacity, scale: arrivalScale }} className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
          <motion.div style={{ opacity: stampOpacity, rotate: stampRotate }} className="w-24 mb-4">
            <PassportStamp className="w-full" />
          </motion.div>
          <div className="text-brand-700 text-sm font-bold uppercase tracking-[0.2em]">Welcome to Dubai</div>
          <div className="mt-3 scale-125"><Logo size="lg" /></div>
        </motion.div>
      </div>
    </section>
  );
}
