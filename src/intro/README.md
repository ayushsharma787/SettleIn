# IntroStory — scroll-driven storytelling intro

A pinned, scroll-scrubbed story sequence that plays **before** the main Ahlan
experience: a traveler leaves India, lands in Dubai, gets swarmed by paperwork,
watches it consolidate into the Ahlan roadmap, and is handed a
"Start your journey" CTA that drops them onto Screen 1 (Welcome / mode select)
of the existing app.

## Files

| File             | What it is |
| ---------------- | ---------- |
| `IntroStory.jsx` | The whole sequence: Lenis smooth scrolling, the pinned GSAP master timeline (`ScrubStory`), and the reduced-motion fallback (`StaticStory`). |
| `scenes.jsx`     | Flat/geometric SVG + Tailwind building blocks: `Traveler`, `Sun`, the paperwork `Chip`s, and `MiniRoadmapPhone` (a stylized preview of the real Roadmap screen). Skylines/plane/stamp are reused from `src/site/illustrations.jsx`. |

Nothing inside the existing 7-screen prototype (`src/screens/`,
`src/PrototypeShell.jsx`, `src/context/`) was changed. The only touch points
outside `src/intro/` are:

- `src/App.jsx` — mounts `IntroStory` first and swaps to `<Site>` on
  skip/CTA (`SHOW_INTRO` flag).
- `src/site/Site.jsx` — gained optional `initialLive` / `initialLiveScreen`
  props (default off) so the intro can hand off straight into the live
  prototype at the Welcome screen.

## How to disable

Set the flag in `src/App.jsx`:

```js
const SHOW_INTRO = false;
```

The app then renders exactly as before (marketing site, prototype behind
"Try the app"). No other change needed.

## How to remove entirely

1. Delete `src/intro/`.
2. Restore `src/App.jsx` to `export default function App() { return <Site />; }`.
3. (Optional) Remove the now-unused `initialLive` props from `src/site/Site.jsx`
   and drop the `@gsap/react` + `lenis` dependencies from `package.json`.

## Behaviour notes

- **Skippable** — a persistent "Skip intro" pill (top right) jumps straight to
  Screen 1 at any point; the end-of-story CTA does the same.
- **Reduced motion** — `prefers-reduced-motion: reduce` renders `StaticStory`:
  the same five scenes as plain stacked sections with opacity-only fades. No
  pinning, no scrubbing, no Lenis.
- **Mobile** — the timeline runs with a shorter scroll distance, tighter scrub
  and one fewer parallax cloud via `gsap.matchMedia`; all travel distances are
  viewport-relative so scenes scale down gracefully.
- **Performance** — all motion is transform/opacity; offscreen scene layers sit
  at `autoAlpha: 0` (`visibility: hidden`) so they are never painted. A single
  scrubbed master timeline is used instead of `ScrollTrigger.batch`, which is
  designed for independent reveal triggers, not one continuous pinned story.
  Lenis drives `ScrollTrigger.update` through the GSAP ticker and is destroyed
  on unmount, restoring native scrolling for the main app.
