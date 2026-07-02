# Ahlan — أهلاً

> A scroll-driven storytelling intro + live prototype for **Ahlan**, an
> onboarding companion for expats moving to the UAE.

Ahlan is a navigation layer for relocation: it tells newcomers *what to do next,
in what order, with which documents, and which official portal to use*. It does
**not** process government transactions — it removes the confusion around them.

This repo is a **live pitch demo**: a pinned, scroll-scrubbed intro tells one
person's journey from India to Dubai (GSAP + ScrollTrigger + Lenis), then hands
off to the real, fully-interactive product in a phone frame.

## What's inside

**The intro story** (scroll top → bottom, skippable — see `src/intro/README.md`):

1. **Leaving India** — a traveler boards a plane against a warm skyline.
2. **Landing in Dubai** — Burj Khalifa rises, the passport gets stamped.
3. **The paperwork** — checklist chips (visa, Emirates ID, tenancy…) swarm in.
4. **Consolidation** — the chips fly into a stylized Ahlan roadmap phone.
5. **CTA** — "Start your journey" drops you into the app.

**The live prototype** (fully interactive):

- **Welcome** — individual or employer.
- **Questionnaire** — six tap questions, one at a time.
- **Roadmap** — a personalized, dependency-ordered timeline. Completed / current / locked steps. Steps are included or excluded from your answers (school only for families, driving/car only if you drive, housing skipped if you already have a tenancy). Marking a step complete unlocks the next.
- **Step detail** — required documents, the correct portal (GDRFA / ICP / DEWA / Ejari / RTA…), processing time, the one common mistake to avoid, a dependency explanation, and referral cards (banks, insurance, telecom, housing) with an explicit-consent modal.
- **Pricing** — Free · Plus (AED 99) · Concierge (AED 499).
- **Cost calculator** — live first-3-months budget by emirate, family size and area.
- **Employer view** — Nexa Tech, six employees, progress bars, stuck-employee flags, an invite-new-hire modal, "For employer / For employee" tabs (the employee tab shows James Miller's read-only roadmap), a compliance radar (visa / Emirates ID / insurance expiry alerts), and B2B pricing: one-time per-hire onboarding fees with volume tiers by company size, plus the recurring **Ahlan Monitor** subscription for analytics, monitoring and renewal notifications.

Pre-loaded persona: **Priya Sharma**, 29, Graphic Designer, employer-sponsored,
Dubai, Indian driving licence, visa already handled — currently on *Personal bank
account*.

## Tech

- **React** + **Vite**
- **Tailwind CSS v4**
- **GSAP + ScrollTrigger** (via `@gsap/react`) — the pinned, scrubbed intro timeline
- **Lenis** — smooth/inertia scrolling during the intro
- **Framer Motion** — component transitions and the intro → app handoff
- **lucide-react** — icons

No backend, no auth, no APIs. Everything runs on in-memory sample data.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Deploy (Netlify)

`netlify.toml` is included. Connect the repo in Netlify (or drag-and-drop the
`dist/` folder). Build command `npm run build`, publish directory `dist`. The
SPA redirect rule is already configured.

## Project structure

```
src/
  App.jsx                     # intro → phone-framed app handoff (SHOW_INTRO flag)
  main.jsx
  index.css                   # Tailwind theme + keyframes
  intro/                      # the scroll-story intro (self-contained)
    IntroStory.jsx            # Lenis + pinned GSAP timeline + reduced-motion fallback
    scenes.jsx                # traveler, plane, chips, mini roadmap phone
    illustrations.jsx         # inline SVG skylines, clouds, stamp
    README.md                 # how to disable / remove the intro
  PrototypeShell.jsx          # screen router for the phone app
  components/                 # PhoneViewport, RoadmapTimeline, Logo, ProgressBar, Icon…
  screens/                    # Welcome, Questionnaire, Generating, Roadmap,
                              # StepDetail, Tiers, Calculator, Employer, EmployerEmployee
  context/AppContext.jsx      # in-memory state + navigation (supports preview mode)
  lib/roadmap.js              # dependency-aware roadmap engine
  data/                       # steps, portals, referrals, persona, employer
```
