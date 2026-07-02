// IntroStory — a scroll-driven storytelling intro that plays before the main
// Ahlan experience. One continuous pinned GSAP timeline (scrubbed to scroll,
// smoothed by Lenis) morphs through five scenes:
//
//   1. Leaving India   — traveler boards a plane against a warm skyline
//   2. Landing in Dubai — Burj Khalifa rises, passport stamp pops
//   3. The paperwork    — checklist chips swarm in around the traveler
//   4. Consolidation    — chips fly into a stylized Ahlan roadmap phone
//   5. CTA              — "Start your journey" hands off to the app
//
// Self-contained: everything lives in src/intro/. See src/intro/README.md
// for how to disable or remove the sequence.
//
// Accessibility & performance notes:
// - prefers-reduced-motion renders <StaticStory> instead: plain stacked
//   sections with opacity-only fades, no pinning, no Lenis.
// - All motion is transform/opacity only. Scenes that aren't on screen sit at
//   autoAlpha:0 (visibility:hidden), so the browser skips painting them —
//   this replaces ScrollTrigger.batch, which targets independent reveal
//   triggers rather than a single scrubbed master timeline.
// - Mobile gets a shorter scroll distance, tighter scrub and fewer parallax
//   layers via gsap.matchMedia.
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';
import { Cloud, IndiaSkyline, DubaiSkyline, PassportStamp } from './illustrations.jsx';
import { Traveler, StoryPlane, Sun, CHIPS, CHIP_SPOTS, Chip, MiniRoadmapPhone } from './scenes.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SCENE_STARTS = [0, 0.2, 0.42, 0.64, 0.85];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// Headline with per-word mask spans so GSAP can stagger-reveal the words.
function Headline({ id, title, sub, className = '' }) {
  return (
    <div className={`st-h st-h${id} absolute inset-x-0 px-6 text-center pointer-events-none ${className}`}>
      <h2 className="text-[26px] leading-[1.15] sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-2xl mx-auto">
        {title.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-2 -mb-2">
            <span className="st-word inline-block will-change-transform">{word}&nbsp;</span>
          </span>
        ))}
      </h2>
      {sub && (
        <p className="st-sub mt-3 text-sm sm:text-lg text-slate-500 font-medium max-w-md mx-auto">{sub}</p>
      )}
    </div>
  );
}

export function IntroStory({ onEnter }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative bg-white">
      {/* persistent chrome: brand + skip */}
      <div className="fixed top-3 left-4 z-[70]">
        <div className="bg-white/70 backdrop-blur rounded-full px-3 py-1.5 ring-1 ring-slate-200/70 shadow-sm">
          <Logo size="sm" />
        </div>
      </div>
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={onEnter}
        className="fixed top-3 right-4 z-[70] inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur text-slate-600 text-sm font-bold px-4 py-2 ring-1 ring-slate-200 shadow-sm hover:text-slate-900 hover:ring-brand-300 active:scale-95 transition"
        data-testid="skip-intro"
      >
        Skip intro <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>

      {reduced ? <StaticStory onEnter={onEnter} /> : <ScrubStory onEnter={onEnter} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScrubStory — the full pinned, Lenis-smoothed, scroll-scrubbed sequence.
// ---------------------------------------------------------------------------
function ScrubStory({ onEnter }) {
  const root = useRef(null);
  const stageRef = useRef(null);
  const dotRefs = useRef([]);

  // Lenis inertia scrolling, driven by the GSAP ticker while the intro is
  // mounted. Destroyed (and native scrolling restored) on unmount.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      const stage = stageRef.current;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia(root);

      mm.add(
        { isMobile: '(max-width: 639px)', isDesktop: '(min-width: 640px)' },
        (ctx) => {
          const { isMobile } = ctx.conditions;
          const sw = () => stage.clientWidth;
          const sh = () => stage.clientHeight;
          const centerOf = (el, fx = 0.5, fy = null) => ({
            x: sw() * fx - (el.offsetLeft + el.offsetWidth / 2),
            ...(fy !== null ? { y: sh() * fy - (el.offsetTop + el.offsetHeight / 2) } : {}),
          });

          // ------- initial states (offscreen scenes hidden => not painted)
          gsap.set(q('.st-bg-teal, .st-bg-white'), { autoAlpha: 0 });
          gsap.set(q('.st-cloud'), { autoAlpha: 0 });
          gsap.set(q('.st-dubai'), { yPercent: 100, autoAlpha: 0 });
          gsap.set(q('.st-stamp'), { scale: 0, autoAlpha: 0, rotation: -18 });
          gsap.set(q('.st-chip'), {
            autoAlpha: 0,
            scale: 0.4,
            y: 46,
            rotation: (i, el) => Number(el.dataset.rot || 0),
          });
          gsap.set(q('.st-phone'), { autoAlpha: 0, y: 150, scale: 0.86 });
          gsap.set(q('.ip-check'), { scale: 0 });
          gsap.set(q('.ip-row'), { autoAlpha: 0.35, y: 10 });
          gsap.set(q('.st-h2 .st-word, .st-h3 .st-word, .st-h4 .st-word, .st-h5 .st-word'), { yPercent: 120 });
          gsap.set(q('.st-h2, .st-h3, .st-h4, .st-h5'), { autoAlpha: 0 });
          gsap.set(q('.st-h2 .st-sub, .st-h3 .st-sub, .st-h4 .st-sub, .st-h5 .st-sub'), { autoAlpha: 0, y: 16 });
          gsap.set(q('.st-cta'), { autoAlpha: 0, y: 28 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: isMobile ? '+=3800' : '+=5400',
              scrub: isMobile ? 0.5 : 1,
              pin: true,
              anticipatePin: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                dotRefs.current.forEach((dot, i) => {
                  if (!dot) return;
                  const next = SCENE_STARTS[i + 1] ?? 1.01;
                  dot.dataset.active = self.progress >= SCENE_STARTS[i] && self.progress < next ? 'true' : 'false';
                });
              },
            },
          });

          // =============== SCENE 1 — leaving India (0–10)
          tl.to(q('.st-hint'), { autoAlpha: 0, duration: 1.2 }, 0.6);
          // traveler rolls her suitcase over to the plane, then boards
          tl.to(q('.st-traveler'), { x: () => sw() * (isMobile ? 0.22 : 0.16), duration: 3.2, ease: 'power1.inOut' }, 0.4);
          tl.to(q('.st-traveler'), { autoAlpha: 0, scale: 0.85, x: `+=${isMobile ? 26 : 40}`, duration: 1, ease: 'power1.in' }, 3.4);
          // plane taxis, then lifts off toward the top right
          tl.to(q('.st-plane'), { x: '18vw', duration: 2.4, ease: 'power1.in' }, 4.4);
          tl.to(q('.st-plane'), { x: '85vw', y: '-75vh', rotation: -14, duration: 3.6, ease: 'power1.in' }, 6.4);
          tl.to(q('.st-h1'), { autoAlpha: 0, y: -44, duration: 1.8 }, 6.2);
          // India sinks away as we climb; the sun sets with it
          tl.to(q('.st-india'), { yPercent: 70, autoAlpha: 0, duration: 3.4, ease: 'power1.in' }, 6.8);
          tl.to(q('.st-sun'), { y: '22vh', autoAlpha: 0, duration: 4, ease: 'power1.in' }, 7);
          tl.to(q('.st-bg-warm'), { autoAlpha: 0, duration: 5 }, 8.5);
          tl.to(q('.st-bg-teal'), { autoAlpha: 1, duration: 5 }, 8.5);

          // =============== SCENE 2 — landing in Dubai (10–20)
          // clouds drift past at cruising altitude (parallax speeds)
          tl.to(q('.st-cloud-1'), { autoAlpha: 0.9, duration: 1.2 }, 9.2);
          tl.to(q('.st-cloud-2'), { autoAlpha: 0.7, duration: 1.2 }, 9.8);
          tl.to(q('.st-cloud-1'), { x: '-42vw', duration: 8, ease: 'none' }, 9.2);
          tl.to(q('.st-cloud-2'), { x: '-26vw', duration: 8, ease: 'none' }, 9.8);
          if (!isMobile) {
            tl.to(q('.st-cloud-3'), { autoAlpha: 0.8, duration: 1.2 }, 10.4);
            tl.to(q('.st-cloud-3'), { x: '-58vw', duration: 8, ease: 'none' }, 10.4);
          }
          tl.to(q('.st-cloud'), { autoAlpha: 0, duration: 1.6 }, 16.6);

          // plane re-enters high on the left and glides down to land
          tl.set(q('.st-plane'), { x: '-75vw', y: '-52vh', rotation: 3 }, 10);
          tl.to(q('.st-plane'), { x: '-8vw', y: '-38vh', duration: 2.9, ease: 'power2.out' }, 10.1);
          tl.to(q('.st-plane'), { x: '-2vw', y: '-36vh', duration: 1.2 }, 13);
          tl.to(q('.st-plane'), { x: '4vw', y: '0vh', rotation: 0, duration: 3.6, ease: 'power2.out' }, 14.2);
          tl.to(q('.st-plane'), { x: '9vw', duration: 1.6, ease: 'power2.out' }, 17.8);

          // Dubai rises to meet us
          tl.to(q('.st-dubai'), { yPercent: 0, autoAlpha: 1, duration: 4.4, ease: 'power1.out' }, 11.6);

          tl.to(q('.st-h2'), { autoAlpha: 1, duration: 0.4 }, 11.8);
          tl.to(q('.st-h2 .st-word'), { yPercent: 0, duration: 1.4, stagger: 0.18, ease: 'power3.out' }, 11.8);
          tl.to(q('.st-h2 .st-sub'), { autoAlpha: 1, y: 0, duration: 1.2 }, 13);
          tl.to(q('.st-h2'), { autoAlpha: 0, y: -36, duration: 1.6 }, 18.2);

          // touchdown: passport stamp slams in
          tl.to(q('.st-stamp'), { scale: 1, autoAlpha: 1, rotation: 8, duration: 1.4, ease: 'back.out(2.2)' }, 16.4);
          tl.to(q('.st-stamp'), { scale: 1.18, autoAlpha: 0, duration: 1.4, ease: 'power1.in' }, 19);

          // =============== SCENE 3 — the paperwork swarm (20–31)
          tl.to(q('.st-plane'), { x: '70vw', autoAlpha: 0, duration: 2.2, ease: 'power1.in' }, 20);
          // skyline recedes into a distant backdrop
          tl.to(q('.st-dubai'), { yPercent: 26, autoAlpha: 0.38, duration: 3, ease: 'power1.inOut' }, 20.4);
          // traveler steps off, front and centre
          tl.set(q('.st-traveler'), { x: () => centerOf(q('.st-traveler')[0]).x, scale: 1, y: 20 }, 20.6);
          tl.to(q('.st-traveler'), { autoAlpha: 1, y: 0, duration: 1.8, ease: 'power2.out' }, 20.8);

          tl.to(q('.st-h3'), { autoAlpha: 1, duration: 0.4 }, 21.6);
          tl.to(q('.st-h3 .st-word'), { yPercent: 0, duration: 1.4, stagger: 0.14, ease: 'power3.out' }, 21.6);
          tl.to(q('.st-h3 .st-sub'), { autoAlpha: 1, y: 0, duration: 1.2 }, 22.8);

          // chips pop in one by one, tied to scroll
          tl.to(
            q('.st-chip'),
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1.3,
              stagger: 1.05,
              ease: 'back.out(1.7)',
            },
            22.6,
          );
          tl.to(q('.st-h3'), { autoAlpha: 0, y: -36, duration: 1.6 }, 29.4);

          // =============== SCENE 4 — chips become the Ahlan roadmap (30–41)
          // every chip flies into the phone slot and is absorbed
          q('.st-chip').forEach((chipEl, i) => {
            tl.to(
              chipEl,
              {
                x: () => centerOf(chipEl).x,
                y: () => sh() * 0.52 - (chipEl.offsetTop + chipEl.offsetHeight / 2),
                scale: 0.2,
                rotation: 0,
                autoAlpha: 0,
                duration: 2.2,
                ease: 'power2.in',
              },
              30.6 + i * 0.35,
            );
          });
          tl.to(q('.st-traveler'), { autoAlpha: 0, y: 26, duration: 1.6 }, 30.4);
          tl.to(q('.st-dubai'), { autoAlpha: 0.16, yPercent: 40, duration: 3 }, 30.6);
          tl.to(q('.st-bg-white'), { autoAlpha: 1, duration: 4 }, 30.8);

          tl.to(q('.st-phone'), { autoAlpha: 1, y: 0, scale: 1, duration: 2.8, ease: 'power2.out' }, 31.8);
          tl.to(q('.ip-row'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.55, ease: 'power2.out' }, 33.6);
          tl.to(q('.ip-check'), { scale: 1, duration: 0.9, stagger: 0.75, ease: 'back.out(2.4)' }, 34.6);
          tl.to(q('.ip-fill'), { width: '64%', duration: 4.6, ease: 'power1.inOut' }, 34.4);

          tl.to(q('.st-h4'), { autoAlpha: 1, duration: 0.4 }, 33.2);
          tl.to(q('.st-h4 .st-word'), { yPercent: 0, duration: 1.4, stagger: 0.12, ease: 'power3.out' }, 33.2);
          tl.to(q('.st-h4 .st-sub'), { autoAlpha: 1, y: 0, duration: 1.2 }, 34.4);
          tl.to(q('.st-h4'), { autoAlpha: 0, y: -36, duration: 1.6 }, 39.6);

          // =============== SCENE 5 — CTA (41–47)
          tl.to(q('.st-phone'), { y: () => -sh() * (isMobile ? 0.1 : 0.07), scale: 0.9, duration: 3, ease: 'power1.inOut' }, 41);
          tl.to(q('.st-h5'), { autoAlpha: 1, duration: 0.4 }, 42);
          tl.to(q('.st-h5 .st-word'), { yPercent: 0, duration: 1.4, stagger: 0.16, ease: 'power3.out' }, 42);
          tl.to(q('.st-h5 .st-sub'), { autoAlpha: 1, y: 0, duration: 1.2 }, 43);
          tl.to(q('.st-cta'), { autoAlpha: 1, y: 0, duration: 1.6, ease: 'power2.out' }, 43.6);
          // hold the final frame briefly before the pin releases
          tl.to({}, { duration: 2.4 });
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {/* scene progress dots */}
      <div className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2.5 pointer-events-none">
        {SCENE_STARTS.map((s, i) => (
          <span
            key={s}
            ref={(el) => { dotRefs.current[i] = el; }}
            data-active={i === 0 ? 'true' : 'false'}
            className="w-1.5 h-1.5 rounded-full bg-slate-300 transition-all duration-300 data-[active=true]:h-5 data-[active=true]:bg-brand-500"
          />
        ))}
      </div>

      <section ref={stageRef} className="relative h-[100dvh] min-h-[560px] overflow-hidden">
        {/* backgrounds — crossfaded, never a hard cut */}
        <div
          className="st-bg-warm absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #fffaf0 0%, #fdeed3 52%, #f8e2ba 100%)' }}
        />
        <div
          className="st-bg-teal absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #eafaf6 0%, #d9f4ec 55%, #c2efe3 100%)' }}
        />
        <div
          className="st-bg-white absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4fbf9 60%, #e8f7f2 100%)' }}
        />

        {/* scene 1/2 sky + ground elements */}
        <Sun className="st-sun absolute w-24 sm:w-32 right-[12%] top-[14%] will-change-transform" />
        <div className="st-clouds absolute inset-0 pointer-events-none text-white">
          <Cloud className="st-cloud st-cloud-1 absolute w-36 sm:w-52 left-[70%] top-[16%] will-change-transform" />
          <Cloud className="st-cloud st-cloud-2 absolute w-28 sm:w-40 left-[85%] top-[38%] will-change-transform" />
          <Cloud className="st-cloud st-cloud-3 absolute hidden sm:block w-44 left-[78%] top-[58%] will-change-transform" />
        </div>

        <div className="st-india absolute inset-x-0 bottom-0 flex justify-center will-change-transform">
          <IndiaSkyline className="w-[min(120vw,640px)] translate-y-[8%]" />
        </div>
        <div className="st-dubai absolute inset-x-0 bottom-0 flex justify-center will-change-transform">
          <DubaiSkyline className="w-[min(130vw,720px)] translate-y-[6%]" />
        </div>

        {/* actors */}
        <div className="st-plane absolute left-[30%] sm:left-[36%] bottom-[2%] sm:bottom-[3%] w-48 sm:w-80 text-slate-500 will-change-transform">
          <StoryPlane className="w-full" />
        </div>
        <div className="st-traveler absolute left-[8%] sm:left-[16%] bottom-[4%] sm:bottom-[5%] w-24 sm:w-32 will-change-transform">
          <Traveler className="w-full" />
        </div>
        <div className="st-stamp absolute left-[30%] sm:left-[34%] top-[26%] sm:top-[28%] -translate-x-1/2 will-change-transform">
          <div className="rounded-full bg-white/90 p-3 sm:p-4 shadow-xl shadow-brand-900/10 ring-1 ring-brand-100">
            <PassportStamp className="w-24 sm:w-36" />
          </div>
        </div>

        {/* scene 3 — paperwork chips */}
        <div className="st-chips absolute inset-0 pointer-events-none">
          {CHIPS.map((chip, i) => (
            <div
              key={chip.id}
              className="st-chip absolute will-change-transform"
              data-rot={CHIP_SPOTS[i].rotate}
              style={{ left: CHIP_SPOTS[i].left, right: CHIP_SPOTS[i].right, top: CHIP_SPOTS[i].top }}
            >
              <Chip chip={chip} />
            </div>
          ))}
        </div>

        {/* scene 4 — the roadmap phone */}
        <div className="st-phone absolute inset-0 flex items-center justify-center pt-8 will-change-transform">
          <MiniRoadmapPhone />
        </div>

        {/* headlines */}
        <Headline
          id={1}
          className="top-[10%] sm:top-[12%]"
          title="Every new life starts with a goodbye."
          sub="Scroll to follow the journey from home to أهلاً."
        />
        <Headline
          id={2}
          className="top-[10%] sm:top-[12%]"
          title="Ahlan! Welcome to the UAE."
          sub="Touchdown in Dubai. The adventure begins."
        />
        <Headline
          id={3}
          className="top-[8%] sm:top-[10%]"
          title="Then the paperwork hits."
          sub="Visa runs, ID appointments, tenancy contracts — all at once, in an unfamiliar system."
        />
        <Headline
          id={4}
          className="top-[6%] sm:top-[9%]"
          title="Ahlan turns chaos into a roadmap."
          sub="One clear path — what to do, in what order, with which documents."
        />
        <Headline id={5} className="top-[8%] sm:top-[11%]" title="Ready to feel at home?" />

        {/* scene 5 CTA */}
        <div className="st-cta absolute inset-x-0 bottom-[7%] sm:bottom-[9%] flex flex-col items-center gap-3 px-6">
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-base sm:text-lg font-extrabold px-8 py-4 shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-0.5 active:scale-95 transition"
            data-testid="start-journey"
          >
            <Sparkles className="w-5 h-5" /> Start your journey <ArrowRight className="w-5 h-5" />
          </button>
          <div className="text-xs text-slate-400 font-semibold">Demo mode · sample data · no login</div>
        </div>

        {/* scroll hint */}
        <div className="st-hint absolute inset-x-0 bottom-5 flex flex-col items-center gap-1 text-slate-500 pointer-events-none">
          <span className="text-xs font-bold tracking-[0.18em] uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StaticStory — prefers-reduced-motion fallback. No pinning, no Lenis, no
// scrubbing: the same five scenes as stacked sections with gentle
// opacity-only fades.
// ---------------------------------------------------------------------------
function FadeSection({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
      className={`relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center ${className}`}
    >
      {children}
    </motion.section>
  );
}

function StaticHeadline({ title, sub }) {
  return (
    <div className="relative max-w-xl mx-auto">
      <h2 className="text-[26px] leading-tight sm:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-3 text-sm sm:text-lg text-slate-500 font-medium">{sub}</p>}
    </div>
  );
}

function StaticStory({ onEnter }) {
  return (
    <div className="bg-white">
      <FadeSection className="bg-gradient-to-b from-[#fffaf0] via-[#fdeed3] to-[#f8e2ba]">
        <StaticHeadline
          title="Every new life starts with a goodbye."
          sub="Follow the journey from home to أهلاً."
        />
        <div className="relative mt-8 flex items-end gap-4">
          <Traveler className="w-24 sm:w-28" />
          <StoryPlane className="w-48 sm:w-64 text-slate-400" />
        </div>
        <IndiaSkyline className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(120vw,560px)] pointer-events-none" />
      </FadeSection>

      <FadeSection className="bg-gradient-to-b from-[#eafaf6] via-[#d9f4ec] to-[#c2efe3]">
        <StaticHeadline title="Ahlan! Welcome to the UAE." sub="Touchdown in Dubai. The adventure begins." />
        <div className="relative mt-8 flex items-center gap-6">
          <StoryPlane className="w-44 sm:w-60 text-slate-400" />
          <PassportStamp className="w-24 sm:w-32" />
        </div>
        <DubaiSkyline className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(130vw,640px)] pointer-events-none" />
      </FadeSection>

      <FadeSection>
        <StaticHeadline
          title="Then the paperwork hits."
          sub="Visa runs, ID appointments, tenancy contracts — all at once, in an unfamiliar system."
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-md">
          {CHIPS.map((chip) => (
            <Chip key={chip.id} chip={chip} />
          ))}
        </div>
        <Traveler className="w-24 sm:w-28 mt-8" />
      </FadeSection>

      <FadeSection className="bg-gradient-to-b from-white to-brand-50">
        <StaticHeadline
          title="Ahlan turns chaos into a roadmap."
          sub="One clear path — what to do, in what order, with which documents."
        />
        <MiniRoadmapPhone className="mt-8" staticDone />
      </FadeSection>

      <FadeSection className="bg-gradient-to-b from-brand-50 to-white">
        <StaticHeadline title="Ready to feel at home?" />
        <button
          onClick={onEnter}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-base sm:text-lg font-extrabold px-8 py-4 shadow-xl shadow-brand-600/30 active:scale-95 transition"
          data-testid="start-journey"
        >
          <Sparkles className="w-5 h-5" /> Start your journey <ArrowRight className="w-5 h-5" />
        </button>
        <div className="mt-3 text-xs text-slate-400 font-semibold">Demo mode · sample data · no login</div>
      </FadeSection>
    </div>
  );
}
