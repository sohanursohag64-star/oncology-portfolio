# Medical Oncologist Portfolio

Bengali-first portfolio for a Medical Oncologist: an asymmetric editorial layout with 3D scientific visualisations.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber 9 · three.js · drei · Motion · Lucide

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before launch: replace every placeholder

All copy lives in `src/lib/content.ts`. **No qualifications, affiliations, publications or clinical claims were invented.** Every `[...]` value is a placeholder:

- `doctor`: name, degrees, affiliation, phone, email, address and hours
- `doctor.portrait`: put a portrait (about 4:5) in `/public` and set the path, e.g. `"/doctor.jpg"`. Until then an illustrated silhouette is shown.
- `about.body[0]`, `about.facts`, `about.quote`
- `publications`: real title, journal, year and `href` (DOI). Remove `placeholder: true` once an entry is real.
- `expertise`: these describe the *field* of Medical Oncology for patients. Confirm the list matches the doctor's practice.

## Reference analysis

| Reference | What we kept |
|---|---|
| 1. DNA landing page | Big rounded hero panel on a pale canvas; oversized two-tone headline on the left; 3D object in the centre; a floating article card on the right; a pill nav with an active highlight |
| 2. Healthcare landing page | Glassy, translucent 3D forms; soft sky-blue light; a floating "personalised care" card overlapping the scene |
| 3. Cell render | Cut-away cell with nucleus and organelles, used for the "Cancer Biology" model, in the light palette instead of dark |
| 4. Fanned portrait cards | 3D card fan with perspective, used for the Publications covers |

**Not kept:** dark backgrounds, neon, and the "100K+ clients" social proof (that would be an invented claim).

## Visual architecture

```
Navbar      glass pill nav, active-section highlight (shared layout animation)
Hero        [ editorial copy, 6 cols ] [ molecule (WebGL) → arch portrait → orbit ring ]
                                       + "Specialty" chip + patient-education card (overlapping)
About       [ oversized title + floating glass forms (WebGL) ] [ text panel over pastel slab, quote card offset ]
Expertise   [ topic tabs ] [ pastel stage with interactive 3D model ] + detail card overlapping the stage edge
Approach    4 steps, staggered vertical rhythm, progress line drawn by scroll
Publications  CSS-3D fanned cover cards (fan out into view, pointer tilt on hover)
Contact     pastel panel, glass info tiles, medical disclaimer
```

Tokens (`src/app/globals.css`): primary `#2788B9`, secondary `#DFF4FC`, canvas `#F8FCFE`, ink `#183B52` and accent `#70C9E8`. Fonts are Hind Siliguri (Bengali) and Inter (English), loaded with `next/font`.

## Animation plan

| Where | Technique | Restraint |
|---|---|---|
| Hero molecule | Instanced ball-and-stick network + particle shell + proximity lines; slow Y rotation; eased pointer follow (window-level, so it never blocks clicks) | ~0.09 rad/s; sits behind the portrait and to the right of the headline |
| Portrait | 3 layers (organic blob / arch portrait / orbit ring) with different pointer + scroll parallax; arch clip-path entrance | Springs with low stiffness; off on touch devices |
| About | Transmission glass torus, icosahedron, capsule and rounded box floating with `Float`; small scroll-linked turn | Opacity 80%, kept behind and below the title |
| Expertise | One canvas, 4 models: B-DNA (right-handed, ~10.5 bp/turn, major/minor grooves), generic small molecule, IgG antibody (12 Ig domains, heavy and light chains), cell cross-section | Drag-to-rotate with snap back; every model carries a "simplified model" caption |
| Publications | CSS 3D transforms (no WebGL): stacked → fan, per-card pointer tilt | Tilt is ±10° at most |
| Scroll | Motion `whileInView` staggered reveals, subtle `useScroll` parallax | `once: true`; no scroll-jacking |

GSAP was **not needed**. Motion covers every scroll and entrance effect, so the extra library weight was skipped.

## Performance and accessibility

- **Lazy 3D:** each scene is its own `dynamic(..., { ssr: false })` chunk. It mounts only when its slot is within 300px of the viewport (`LazyScene`).
- **No off-screen rendering:** `frameloop="never"` while a scene is out of view.
- **Device tiers** (`capability.tsx`):
  - `high`: full quality
  - `low` (touch, narrow or ≤4 cores): fewer particles and segments, no transmission, DPR capped at 1.25
  - `static` (no WebGL, Save-Data, <2 GB memory or <4 cores): SVG art only
- **Reduced motion:** Motion respects it via `MotionConfig reducedMotion="user"`. 3D scenes render one still frame (`frameloop="demand"`) with no rotation, pointer follow or drag.
- **No layout shift:** every 3D slot has a fixed size or aspect ratio. The SVG fallback holds the space and cross-fades to the canvas after its first frame. Measured CLS on mobile is 0.
- **Readable:** semantic headings, tabs with `role="tab"`, a skip link, and visible focus rings.
