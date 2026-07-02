# Ahlan — أهلاً

> An interactive scrollytelling site + live prototype for **Ahlan**, an onboarding
> companion for expats moving to the UAE.
>
> **From six weeks of chaos to six hours of clarity.**

Ahlan is a navigation layer for relocation: it tells newcomers *what to do next,
in what order, with which documents, and which official portal to use*. It does
**not** process government transactions — it removes the confusion around them.

This repo is a **live pitch demo**. The website itself is the pitch: you scroll
through one person's journey from India to Dubai, the chaos of settling in
reorganizes into a clear roadmap, and a pinned phone walks through the real,
fully-interactive product.

## What's inside

**The storytelling site** (scroll top → bottom):

1. **Hero** — India ↔ Dubai, a waiting plane, floating clouds.
2. **Journey** — a pinned scene: the plane takes off, clouds parallax, India fades, Dubai grows, the passport gets stamped, the Ahlan logo appears.
3. **Chaos → Order** — nine relocation tasks scatter with question marks ("Nobody tells you what comes first"), then snap into a clean, checked roadmap ("Ahlan creates the roadmap").
4. **Pinned phone demo** — the phone stays pinned while scroll advances it through eight real app screens.
5. **Timeline** — every task lights up green (GSAP ScrollTrigger).
6. **Finale** — "You didn't just move. You arrived." + CTAs.

**The live prototype** (click *Try the app* or *Launch the live prototype* — fully interactive):

- **Welcome** — individual or employer.
- **Questionnaire** — six tap questions, one at a time.
- **Roadmap** — a personalized, dependency-ordered timeline. Completed / current / locked steps. Steps are included or excluded from your answers (school only for families, driving/car only if you drive, housing skipped if you already have a tenancy). Marking a step complete unlocks the next.
- **Step detail** — required documents, the correct portal (GDRFA / ICP / DEWA / Ejari / RTA…), processing time, the one common mistake to avoid, a dependency explanation, and referral cards (banks, insurance, telecom, housing) with an explicit-consent modal.
- **Pricing** — Free · Plus (AED 99) · Concierge (AED 499).
- **Cost calculator** — live first-3-months budget by emirate, family size and area.
- **Employer view** — Nexa Tech, six employees, progress bars, stuck-employee flags, an invite-new-hire modal, and a read-only per-employee roadmap.

Pre-loaded persona: **Priya Sharma**, 29, Graphic Designer, employer-sponsored,
Dubai, Indian driving licence, visa already handled — currently on *Personal bank
account*.

## Tech

- **React** + **Vite**
- **Tailwind CSS v4**
- **Framer Motion** — scroll-linked transforms, entrance and layout animations
- **GSAP + ScrollTrigger** — the timeline reveal
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
  App.jsx                     # renders the site
  main.jsx
  index.css                   # Tailwind theme + keyframes
  site/                       # the scrollytelling website
    Site.jsx                  # assembles sections + live-prototype overlay
    Hero.jsx  Journey.jsx  ChaosOrder.jsx
    PhoneDemo.jsx             # pinned phone, scroll-driven screens
    TimelineReveal.jsx  Finale.jsx  LiveOverlay.jsx
    illustrations.jsx         # inline SVG skylines, plane, keys, stamp
  PrototypeShell.jsx          # screen router for the phone app
  components/                 # PhoneViewport, RoadmapTimeline, Logo, ProgressBar, Icon…
  screens/                    # Welcome, Questionnaire, Generating, Roadmap,
                              # StepDetail, Tiers, Calculator, Employer, EmployerEmployee
  context/AppContext.jsx      # in-memory state + navigation (supports preview mode)
  lib/roadmap.js              # dependency-aware roadmap engine
  data/                       # steps, portals, referrals, persona, employer
```

The same screen components render both inside the pinned scroll demo (preview,
non-interactive) and inside the interactive full-screen overlay — one source of
truth, no fake screenshots.
