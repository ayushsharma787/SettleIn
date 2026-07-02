import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TASKS = [
  { label: 'Medical Fitness', emoji: '🩺' },
  { label: 'Emirates ID', emoji: '🆔' },
  { label: 'Residence Visa', emoji: '📄' },
  { label: 'Bank Account', emoji: '🏦' },
  { label: 'Housing & Ejari', emoji: '🏠' },
  { label: 'Utilities (DEWA)', emoji: '⚡' },
  { label: 'Health Insurance', emoji: '❤️' },
  { label: 'Driving License', emoji: '🚗' },
];

export function TimelineReveal() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.tl-row');
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0.35, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none reverse' },
          },
        );
        const check = row.querySelector('.tl-check');
        const bar = row.querySelector('.tl-bar');
        gsap.fromTo(
          check,
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)', scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' } },
        );
        gsap.fromTo(
          bar,
          { backgroundColor: '#e2e8f0' },
          { backgroundColor: '#17a892', duration: 0.5, scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-24 px-6 bg-white">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Week by week</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">One by one, it all turns green.</h2>
          <p className="mt-2 text-slate-500">Every completed step lights up. The chaos becomes a finished checklist.</p>
        </div>

        <div className="space-y-3">
          {TASKS.map((t) => (
            <div key={t.label} className="tl-row flex items-center gap-4">
              <div className="tl-check w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{t.emoji}</span>
                  <span className="font-bold text-slate-800">{t.label}</span>
                  <span className="ml-auto text-xs font-bold text-brand-600">Done</span>
                </div>
                <div className="tl-bar h-1.5 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
