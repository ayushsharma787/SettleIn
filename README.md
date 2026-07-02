# Ahlan (أهلاً) — UAE Expat Onboarding Companion

> **From six weeks of chaos to six hours of clarity.**

Ahlan is a navigation layer that guides new UAE expats through their post-visa
settling-in journey — what to do next, in what order, with which documents, and
which official portal to use. It does **not** process government transactions.

This repository contains a **fully clickable, mobile-first demo prototype**
built for a live pitch. It runs entirely on in-memory sample data — no login,
no backend, no external calls.

## Run the demo

```bash
npm install
npm run dev
```

Then open the printed URL (default `http://localhost:5173`). The app renders as
a centered phone frame (~420px) on desktop.

## Demo walkthrough

| Screen | How to reach it |
| --- | --- |
| Welcome / mode select | Start page |
| B2C roadmap (pre-loaded persona) | Tap **“Welcome back, Priya”** — 4 steps already done, currently on *Personal bank account* |
| Onboarding questionnaire | Tap **“I’m an individual”** — 6 tap-based questions, then a generated roadmap |
| Step detail | Tap any unlocked step — documents checklist, portal link, wait times, common-mistake tip, referral partners with consent modal, mark-as-complete |
| Plans & pricing | Roadmap menu (☰) → *Plans & pricing* (Free / Plus AED 99 / Concierge AED 499 + à la carte) |
| Cost calculator | Menu → *Cost calculator*, or the **Plus** tier CTA — live 3-month budget by emirate, family size and area |
| Employer view | Welcome → **“I’m an employer”** — Nexa Tech with 6 onboarding employees, stuck-employee flags, read-only roadmap drill-down, invite-new-hire form |

## Product logic in the prototype

- **Personalized roadmap engine** (`src/engine.js`) — steps are filtered by
  questionnaire answers (family → school steps, no driving → no license/car
  steps, employer handled visa → those steps pre-completed) and unlocked via a
  dependency graph ("Complete Emirates ID first").
- **Emirate-aware content** (`src/data.js`) — portals and step names adapt:
  DEWA/Ejari/GDRFA/RTA in Dubai, ADDC/Tawtheeq/ICP in Abu Dhabi, SEWA in Sharjah.
- **Referral layer** — partner cards at the bank, telecom, insurance and
  housing steps, gated behind an explicit consent modal.
- **One product, two audiences** — the employer view reuses the same roadmap
  engine in read-only mode; B2B is a billing difference, not a separate app.

## Stack

React 18 + Vite + Tailwind CSS. No other runtime dependencies.

```
src/
  data.js          # step library, personas, employer data, pricing, cost data
  engine.js        # roadmap building, dependency unlocking, progress
  App.jsx          # navigation stack + app state
  components/      # Welcome, Questionnaire, Roadmap, StepDetail,
                   # Pricing, Calculator, Employer, ui primitives
```

All names, figures, wait times and partner offers are illustrative demo data.
