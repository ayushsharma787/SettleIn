# Ahlan — for Business

> The relocation & compliance OS for UAE employers.

Ahlan (Arabic: *"welcome"*) is the dashboard HR and PRO teams at UAE companies use
to orchestrate every relocating employee's government onboarding — visa,
medical, Emirates ID, MOHRE labour contract, bank, Ejari, DEWA, insurance,
schools — and to track workforce-wide compliance renewals.

Not an HRMS. No payroll, no leave, no attendance. Mobility and compliance
orchestration only.

---

## What's in the box

- **Dependency engine.** Every UAE onboarding step unlocks in strict sequence
  (Entry Permit → Medical → Emirates ID → Visa Stamping → …). The engine is
  the source of truth: mark a step Done and dependents visibly flip from
  Locked → Available.
- **Personalized chains per employee.** Visa type (employer-sponsored /
  golden / freelance), emirate (Dubai=Ejari+DEWA, Abu Dhabi=ADDC), and family
  status (school enrollment only if children) each reshape the step list.
- **Live compliance urgency.** Overdue / <30d / <90d / OK buckets are
  computed from expiry dates — never hardcoded.
- **Realistic seeded data.** Meridian Trading LLC, 16 employees spread across
  the pipeline (golden-visa exec, freelancer, two families with kids, two Abu
  Dhabi cases, two blocked/overdue, three fully complete, several mid-chain),
  27 compliance items across urgency buckets, 17 open tasks.

## Modules

| Module              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| Overview            | KPI cards, pipeline distribution, attention list, activity feed     |
| Onboarding Pipeline | Kanban by stage + sortable table view, filters by visa/emirate/status/PRO |
| Employee Detail     | Vertical dependency roadmap with real-time unlock animation         |
| Compliance          | Expiry table + 3-month calendar grid + Start Renewal                |
| Task Board          | Filterable open-task queue with inline owner reassignment           |
| Documents           | Per-employee document checklist grid                                |
| Analytics           | Slowest-step insight, avg days per step, monthly onboardings, cost saved, risk donut |
| Settings            | Team & roles, read-only step templates, demo reset                  |

Phase 2 modules (employee mobile app, referral marketplace, HRMS integrations,
government portal APIs, bulk CSV import, PRO agency portal) render as
polished "Coming Soon" pages, not dead links.

## Tech

- **Streamlit** — Python web app framework
- **Plotly** — interactive charts (pipeline, bottleneck, monthly, cost)
- **Chart.js** — animated risk donut (CDN-embedded via `st.components.v1.html`)
- **GSAP** — hero and unlock-flash micro-animations (CDN-embedded)
- **pandas** — light data manipulation

No backend, no database, no auth. All state lives in
`st.session_state` for the demo session; edits are lost on refresh.

## Running locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

Then visit http://localhost:8501.

## Layout

```
app.py                      # entry — sidebar nav, top bar, dispatch
requirements.txt
settlein/
    steps.py                # step catalog + per-visa-type templates
    engine.py               # dependency engine (mark done → unlock)
    seed.py                 # company, roster, tasks, compliance, activity
    state.py                # session state mutations (single write path)
    derived.py              # read-only selectors + analytics helpers
    styles.py               # design tokens + injected CSS
    ui.py                   # shared inline UI (chips, avatars, cards)
    pages/
        overview.py
        pipeline.py
        employee_detail.py
        compliance.py
        tasks.py
        documents.py
        analytics.py
        settings.py
        coming_soon.py
```

## The dependency engine

Every mutation to a step's status goes through `engine.update_step_status`,
which:

1. Marks the requested step,
2. Re-walks the dependency graph, and
3. Flips every step whose prerequisites are now all Done from LOCKED to AVAILABLE.

Returns the newly-unlocked step ids so the UI can flash a visible cue.

Steps are declared in `settlein/steps.py`; the shape is deliberately simple
so a Phase 2 admin can edit templates in the UI without touching the engine.

## Deploying

Any Streamlit-compatible host works: **Streamlit Community Cloud** is the
one-click path — connect the GitHub repo and point it at `app.py`. Hugging
Face Spaces (Streamlit SDK) and Render also work with the same
`requirements.txt`.

The Chart.js and GSAP scripts pull from public CDNs. If your host blocks
outbound HTTPS, the app degrades gracefully — content stays visible; only
the micro-animations are lost.
