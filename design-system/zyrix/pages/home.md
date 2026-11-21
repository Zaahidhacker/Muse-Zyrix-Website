# Zyrix — Home page override

> **Master + Overrides pattern (ui-ux-pro-max).** This file overrides
> `design-system/zyrix/MASTER.md` for the home page only. Do NOT treat
> MASTER.md as truth: its first-query output (Brutalist style, pink
> #EC4899 palette, Inter + Playfair) was VERIFIED AND REJECTED as
> off-brief. Do not edit MASTER.md. The resolved system below is the
> authority for this page; where it conflicts with the engine output,
> the user wins, and the landing-page skill wins on fonts.

**Page:** home (zyrix-agency.online / muse-zyrix-website.vercel.app)
**Stack:** Next.js 16 App Router + TypeScript + Tailwind 4, three.js /
@react-three/fiber, GSAP + Lenis
**Source of truth for copy:** `CONTENT.md` — every price, heading,
slogan, FAQ answer, contact and link stays EXACT. No invented
testimonials, stats, logos or prices; anything missing gets a marked
`{{placeholder}}`.

## Pattern — Scroll-Triggered Storytelling (landing.csv #10)

Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3
(solution) > Climax CTA. Mini-CTA at the end of each chapter + final
climax CTA. Progress indicator (nav progress pill, live %). DOM reading
order complete. Reduced-motion renders final states; mobile simplifies
animations. "Each chapter has distinct color" — the page alternates
navy chapters with one blue-tinted light band (Pricing + Risk) that
acts as the curtain the orb dives under.

| Chapter | Section | Mini-CTA |
|---|---|---|
| Hook | Hero — "Premium websites at half the 2026 market rate." | Primary: "Free website plan" → #contact; scroll: "See the 50% difference" → #difference |
| Problem | Difference — "NOT ANOTHER PRETTY PAGE." | "Get your free plan" → #contact |
| Pitch | Result — 11-word pitch word-highlight moment | (no mini-CTA; the pitch is the beat) |
| Proof | Promise — B11 tagline "Same standard. Half the rate." + 50% counter/table | "Get your free plan" → #contact |
| Solution | Services (4, asymmetric) + Journey (4 steps, exact) + Work (3 builds, asymmetric) | Services → "Get your free plan"; Work → "See pricing" → #pricing |
| Solution | Pricing (4 tiers, Business emphasized) + Risk (risk reversal) | Pricing → "Get your free plan"; Risk → "Get your free plan" |
| Close | FAQ (5, side-by-side) | "Get your free plan" → #contact |
| Climax CTA | Contact — free-plan form + WhatsApp fallback; Footer | Form submit "Get free plan" (final CTA) |

Mini-CTAs are small text links (Phosphor `ArrowRight`, aria-hidden),
not competing buttons — one primary action per viewport: the free plan.
No testimonials exist in CONTENT.md, so the Hero + Testimonials + CTA
pattern's testimonial slot is filled by Work (3 builds) + Promise proof
(counter/table). Do not invent testimonials.

## Style — Liquid Glass, scoped (styles.csv #14)

Adaptive translucency derived from surrounding content; use color
judiciously; preserve legibility and hierarchy. Applied ONLY to the
floating nav pill and the frosted scrims (thin veils behind copy over
the 3D scene). NOT to dense reading surfaces — cards stay flat opaque.
Glass params (glassmorphism, styles.csv #3): backdrop-blur 16px
(10–20px range) + saturate(1.4), subtle 1px highlight border,
flat translucent base (never a gradient). Legibility is measured:
the orb veil dims the canvas to 30% under text sections, and scrims
carry a flat translucent navy base, so the composed result (not one
opacity) isolates the foreground.

## Colors — Trust & Authority (landing.csv #33)

Navy/Grey corporate. Trust blue. **Accent for CTA only.**

| Token | Value | Role |
|---|---|---|
| `--p-bg` (secondary) | `#101D49` | Dark ground (replaces black) |
| `--p-surface` | `#182751` | Card/panel ground on navy |
| `--p-ink` | `#EAF2F7` | Text on navy |
| `--p-muted` | `#8694AC` | Secondary text on navy (≥4.5:1 — verify) |
| `--color-blue` (primary) | `#82BODB` | Trust blue: the 3D orb + decorative scene only — NEVER text on navy (2.33:1, fails) |
| `--color-blue-light` | `#A9D1E4` | Text-safe tint of the primary: eyebrows, text links, emphasis on navy (9.99:1) |
| `--color-foam` | `#DCEBF2` | Blue-tinted light ground (Pricing + Risk) |
| `--p-inv-bg` | `#EAF2F7` | Inverse ground (footer band) |
| `--p-inv-surface` | `#D8E2EA` | Inverse card ground |
| `--p-inv-ink` | `#101D49` | Text on light grounds |
| `--p-inv-muted` | `#536284` | Secondary text on light (≥4.5:1 — verify) |
| `--p-accent` / `--p-action` | `#F7EB4F` | **CTA + 50% moments ONLY** (primary button, 50% figures, focus ring on navy) |
| `--p-accent-ink` | `#101D49` | Text on yellow |

Discipline: yellow never appears as body text, eyebrows, links, or
decoration outside a CTA or a 50% moment. **Contrast, verified
numerically 2026-11-21 (the first estimate had the ratios backwards):**
blue #82BODB text is **2.33:1 on navy (fails)** but 5.70–6.14:1 on
pale grounds (passes). Text on navy therefore uses the light tint
#A9D1E4 — 9.99:1 on navy, 8.93:1 on panel #182751, 8.00:1 on panel2
#1E2F5C. Text on light grounds is navy ink (13–14:1). Yellow on
light grounds is ~1.0–1.3:1 — never. Contrast ≥4.5:1 everywhere
(ux-guidelines.csv #36, #76); every pair verified numerically
before delivery.
Three-layer tokens (design-system skill): primitive → semantic →
component; no raw hex in components (audit: WhatsAppFloat dots,
favicon, orb material constants — tokenize; orb colours are primitive
constants defined once in the scene file).

## Typography — one typeface (landing-page skill B1)

**Manrope** only (allowed list: Geist/Manrope/Geist Mono/Poppins;
Poppins is banned by taste-skill; Inter is banned by the landing-page
skill). No italics anywhere. Cap semibold/bold (600/700). Every size
snapped to the Tailwind scale, closest step below. Named text styles
`heading-1..caption-5` as reusable classes in `globals.css`.
- h1 (hero): text-7xl 72px desktop / text-5xl 48px phone, solid mist
  #EAF2F7 (14.33:1). The B5 white → #A9D1E4 text gradient was
  REMOVED 2026-11-21: background-clip:text does not paint on the h1
  in the verification browser (the headline was invisible) while a
  fresh gradient div on the same page paints fine — the h1's
  compositing context over the live WebGL canvas is the trigger.
  Solid mist matches the motion pass the user praised. Max-width
  680px, meaningful line breaks.
- h2: text-6xl 60px / text-4xl 36px. h3/card titles: text-2xl 24px.
- Body: text-base 16px/1.6, measure ~62ch. Labels: text-xs 12px,
  uppercase, tracking, Manrope (no mono).
- Prices/figures: `font-variant-numeric: tabular-nums`.

## Motion — B7 governs (landing-page skill)

Base curve `cubic-bezier(0.22,1,0.36,1)`; duration-500 movement /
duration-300 colour-opacity; transform + opacity only.
- **Hero headline only:** SplitText char stagger (motion.csv #9):
  chars, `expo.out`, 400–700ms, stagger 0.015, `split.revert()` on
  cleanup, reduced-motion renders the final state, plain-text fade
  fallback. GSAP 3.15.1 — SplitText is bundled (3.13+).
- **Section h2s:** word masks, rise + blur, once, 600–800ms.
- **Blocks:** rise 32px + fade, 600–800ms, once, via the existing
  RAF-throttled ScrollTrigger (never unthrottled scroll listeners).
- **Orb:** scroll-driven camera path, scrub:1 equivalent — the
  existing rig damps `scrollState.progress` (threejs.csv #38; keep it,
  do not rewrite to ScrollTrigger scrub). DPR capped 1.75.
- **Gate:** navy curtain, yellow line, Manrope letters, lift on the
  base curve, <1.4s, click to skip, reduced-motion off.
- **Menu:** full-height panel, links stagger 60ms capped at 400ms,
  toggle morphs hamburger ↔ X, Escape closes, focus returns to toggle.
- **Reduced motion:** opacity only; final states immediately; no
  parallax/scrub (ux-guidelines.csv #9, #99).

## Stack guidance (verified searches)

- **Next.js:** streaming/Suspense for slow content (nextjs.csv #10) —
  the 3D orb dynamic import gets a `loading` poster fallback (the CSS
  torus poster); static shell, no route-level loading state needed
  (all routes static).
- **Three.js:** GSAP scroll-driven camera rig for scripted reveals,
  no OrbitControls (threejs.csv #12); register ScrollTrigger once
  (threejs.csv #36); scrub:1 for the camera path (threejs.csv #38).

## Icons (icons.csv + landing-page B6)

Phosphor (`@phosphor-icons/react`) is the default. Regular weight
(1.5px stroke, consistent). Size tokens: `--icon-sm: 16`,
`--icon-md: 20`, `--icon-lg: 24`. No emoji icons. Decorative icons
beside visible text: `aria-hidden="true"`. Icon controls: accessible
name + exposed pressed/expanded/selected state. One icon style per
hierarchy level (outline regular throughout).

## Accessibility — pre-delivery checklist (Quick Reference §1–3)

Apply as the final review; the items below are the ones that change
this build (ux-guidelines.csv refs):
- Contrast ≥4.5:1, verified numerically, both grounds (#36, #76).
- Visible focus ring on every interactive control incl. modal/menu
  controls: 2px solid, 2px offset, 3:1 state contrast (#28, #102);
  yellow on navy, navy on light grounds.
- Focus not obscured: `scroll-padding-top: var(--nav)`; the floating
  nav and WhatsApp float must not cover a focused element (#100).
- Keyboard navigation: tab order = visual order; every action
  operable without a pointer (#41).
- **Error summary** (#109): on failed form submit, focus a summary
  at the top of the form listing each invalid field as a link; keep
  inline errors.
- **Auto-rotating content** (#108): the Services brand-lockup cycler
  gets a pause/play control, pauses on hover/focus, and renders
  static under reduced motion.
- **Live regions** (#118): cart quantity changes announce a contextual
  status ("N items in cart, LKR …") via a polite atomic live region.
- Loading feedback matches the wait; submit button uses `aria-busy`
  while sending (#78).
- Touch targets ≥44px with ≥8px gaps (#22, #23, #66).
- Z-index scale defined, no arbitrary values (#15):
  nav 50 / menu backdrop 55 / menu panel 60 / gate 100 / ring 200.
- No emojis as icons; semantic tokens everywhere; scrims measured
  against the real background.

## Rejected (do not reintroduce)

- Brutalism style; pink #EC4899 palette; black + gold palette;
  Inter + Playfair typography (Inter banned, italics banned).
- Single-side card borders; background gradients (flat surfaces
  only — the WebGL orb is the scene, not a CSS background).
- Testimonials, stats, logos, prices not in CONTENT.md.
- `height:100vh` (use `min-height:100dvh`); equal 3/4-column card
  grids (asymmetric layouts instead); accordion FAQ (side-by-side
  list + inline disclosure instead).
