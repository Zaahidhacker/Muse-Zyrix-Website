# Zyrix rebuild — plan

Line 1 — kind: **service** (agency; people are hired). Page type `service`,
site-kind `other`. Main action: **Get free plan** (the free project plan).
Buyer: Sri Lankan businesses that need a website. One hard fact on screen 1:
websites from LKR 15,000 — half the 2026 market rate.

Line 2 — deal: palette via `start.mjs brand` (the client's own black/gold:
bg #0A0A0A, surface #141414, ink #F5F1E8 cream, muted #A8A29A, accent/action
gold #F0A500; inverse cream #F5F1E8 / ink #0A0A0A) — the three dealt palettes
(swap-pastels, blush-sage-slate, cobalt-on-sand) all clash with the client's
own black/gold brand, so the brand route applies. Black and gold fit the
trade because the live site already sells on them: gold is the price, the
CTA and the torus; black is the studio. Type: first dealt pairing
**Schibsted Grotesk** (neo-grotesk, display 400, tracking -3.5%/-4.2%) for
text and UI; display headlines in **Archivo** with the width axis, condensed,
because the live site's monumental condensed display type is the client's
own visual identity and a non-condensed grotesk fails that hero; italic
**Instrument Serif** for the emphasis words the live site sets in italic
serif ("free plan", "More website"); micro-labels in the system mono stack
(no third webfont). Hero: dealt `product` — the golden continuum torus whole
on the stage across the wrap, head row above (h1 left, lead + buttons right).
Moments: `word-highlight` (the 11-word pitch, dealt) + the scroll-driven
continuum-orb film (the brief's explicit 3D ask; see waivers). `photo-chapters`
not used: no client photographs supplied. Nav `nav-split`, footer
`footer-visit`, close re-dealt `close-photo` → `close-word` (no client
photograph for the close; head row + giant ZYRIX wordmark), rhythm
`dark-band` (the pricing section on the inverse cream ground; the risk
section also cream, exactly as the live site does), buttons `tonal`, mark
`arc` (the Z in a gold ring).

Voice card: technical-dry with a Colombo directness. Pairs: exact, not cold;
sure, not loud. Person: "you" for what the buyer gets, "we" for the work.
Sentences: mostly 8 to 16 words. Humour: none in the hero, the prices or the
FAQ. House words: the brief's own nouns (website, plan, LKR, WhatsApp,
PayHere, LankaQR). Never: virtue words about ourselves, a pun on the name,
a strip of claims. Copy is the live site's own words (CONTENT.md), kept
exactly — including its all-caps headings and its two-fragment lines, which
the lint will flag and which are waived hit by hit as the client's own copy.

## Sections (one idea each; h2 first; `.wrap` edges x80–1360 at 1440, x24–366 at 390)

| # | id | idea | picture / visual | screens |
|---|---|---|---|---|
| 0 | top (hero) | Premium websites at half the 2026 market rate | golden continuum torus, whole on stage | 1 |
| 1 | difference | NOT ANOTHER PRETTY PAGE. | orb passes, small | 1 |
| 2 | result | WE BUILD MOMENTUM. + 11-word pitch (word-highlight moment) | orb centre, word reveal | 1 |
| 3 | promise | Same standard. Half the rate. 60,000 → 30,000 counter + 4-row table | counter + table, dark-band | 1–2 |
| 4 | services | 4 capabilities, each with a LIVE interactive UI mock | brand card / mini cart / ops dashboard / motion demo | 2 |
| 5 | journey | From discovery to payment. 13.9M online, mobile + WhatsApp first | WhatsApp chat mock + payment selector | 2 |
| 6 | work | 3 interactive builds (Koti's / FORM objects / corporate) | working menu + order counter; working cart | 2 |
| 7 | pricing | 4 tiers, market price struck through, cream ground | 4 cards | 2 |
| 8 | risk | Less risk. More website. 4 cards | cream, type-led | 1 |
| 9 | faq | Straight answers. 5 questions, accordion | type-led | 1 |
| 10 | contact | Get your free plan. form → POST /api/plan | form | 1–2 |
| — | footer | Giant ZYRIX, MAKE THE WEB MOVE., CALL / WHATSAPP / EMAIL | close-word | 1 |

Chrome: fixed nav (50% RATE / SERVICES / WORK / PRICING / CONTACT, START AT
15K CTA, live scroll-progress % pill), full-screen mobile menu, floating
WhatsApp button (wa.me/94720551707). Links exact: wa.me/94720551707,
tel:+94720551707, mailto:zyrix.co@outlook.com.

## Tech

Next.js 15 App Router + TypeScript + Tailwind 4. Lenis smooth scroll +
GSAP ScrollTrigger scrub choreography (gsap.context / useGSAP cleanup,
transforms + opacity only, quickTo for pointer). One fixed R3F canvas:
golden liquid-metal torus (MeshDistortMaterial, gold #F0A500, metalness 1,
roughness ~0.2, local Lightformer env — no CDN HDR), pointer rotation,
scroll-driven travel hero → momentum → pricing; DPR capped at 1.75, render
paused when tab hidden, static frame under prefers-reduced-motion, lazy
canvas with a CSS torus poster fallback when WebGL is unavailable.
POST /api/plan: server-validated; Resend when RESEND_API_KEY is set, else a
WhatsApp deep link so no enquiry is ever lost.

## Motion + legibility pass (2026-11-20, user feedback on the live site)

The background/3D was praised ("insane, smooth, doesn't lag") but the text
sat still and blended into the orb. Fixes, all in the black/gold brief
(Unseen Studio as a motion/typography/legibility reference only — no
rebrand, no copy/price/link changes):

- **Intro gate** (`src/components/Gate.tsx` + `src/lib/gate-state.ts`):
  black curtain, ZYRIX letters stagger in from blur, a thin gold line
  draws across, then the gate lifts (~700ms curtain). Total <1.4s first
  visit; returning visitors get a 350ms lift (sessionStorage
  `zyrix-gate-seen`); click to skip; fully disabled under
  prefers-reduced-motion. Dispatches `zyrix:gate-done` at lift start.
- **Scroll reveals** (`src/components/RevealRig.tsx`): every section
  heading splits into word masks (`.rv` / `.rv-i`) that rise from
  blur(8px) + 110% offset, ~50ms stagger, once, via GSAP ScrollTrigger;
  eyebrows/leads/cards/tables/FAQ items fade + rise 24px; card grids
  animate as staggered batches. Hero reveals are paused until the gate
  lifts. Reduced motion: nothing is created (DOM untouched). Gentle
  mode (`html[data-motion="lite"]`): opacity fades only, no blur/rise.
  Splitting keeps spaces as real text nodes, so wrapping and accessible
  names are unchanged.
- **Legibility scrims**: `.scrim` — a small frosted veil
  (backdrop-filter blur(16px) + dark radial gradient) behind hero copy
  and dark-section heads only; never full-screen. Plus an orb veil:
  sections marked `data-dim-orb` dim the fixed canvas to 30% opacity
  and scale 0.93 while centred (`html[data-orb-dim]`). Body copy
  (`.lead.muted`, `.measure.muted`) is cream at 85% instead of the dim
  muted grey on dark grounds.
- **Unseen cues, black/gold**: two-voice headlines — the last word of
  every major h2 and the hero's "rate." sit in thin italic serif (the
  already-loaded Instrument Serif; no new font weight added — Cormorant
  was considered and skipped for that reason); nav links swap to italic
  serif on hover; primary CTAs are pills with a gold flood hover
  (::before scaleX sweep); the mobile menu is a 480px slide-in panel
  from the right with a flat dim backdrop; a thin gold ring cursor
  trails the pointer on pointer:fine desktops only (native cursor
  stays — the ring is a halo, not a replacement). No drop shadows
  anywhere.
- **Perf, unchanged**: DPR cap 1.75, no new animation loops, transforms /
  opacity / filter only, short durations (450–600ms). The old CSS
  `[data-enter]` hero entrance was removed and replaced by the rig.

## Waivers (see .taste-skill/waivers.json)

- effect-kind / WebGL on a service page: the brief explicitly asks for
  interactive 3D and scroll cinema; the golden torus echoes the live site's
  own torus. The skill's structure (one section per screen, equal edges,
  real copy, hero entrance + dealt moments, hover layer) is kept.
- scroll-linked motion outside the dealt moments: the orb film is the page's
  big scene, inside its own scroll range; nothing else moves on scroll.
- FAQ accordion: the brief explicitly requires a working accordion.
- copy-lint hits on the live site's own words (all-caps headings, two
  two-fragment headings, "NO PITCH DECK. NO PRESSURE.", "NO HIDDEN FEES"):
  client's own copy, kept exactly per CONTENT.md.
- Giant ZYRIX wordmark set at display size in hero and footer: the client's
  brand wordmark, per the live site.
- photo-chapters moment not built: no client photographs supplied.
- close-photo → close-word re-deal: no client photograph for the close.
