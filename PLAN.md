# Zyrix rebuild — plan

> Taste gate: **OPEN 22** (round 3 — rounds exhausted; relied on skill guidance + browser evidence).
> **Theme redesign (2026-11-21):** see below — diagnosis, Part A outputs, theme, implementation order.

## Theme redesign (2026-11-21) — diagnosis first (redesign skill: DIAGNOSE, then fix)

### User brief (verbatim intent)
"Make the current Zyrix website better than ever before. Wonderful suspense, wonderful layouts, animations, text colors. Use impeccable and the taste skill to find a new theme. Main primary color #82BODB, secondary color #101D49, then a touch of #F7EB4F."
Impeccable is NOT installed (download from impeccable.style failed with a TLS error; retry awaits the user's decision) — do not pretend to use it. The landing-page, redesign and taste skills are the authorities.

### Theme decision (taste `brand` deal, 2026-11-21)
User colours: dusty blue **#82BODB** primary, deep navy **#101D49** secondary (the dark ground, replacing #0A0A0A black), bright yellow **#F7EB4F** as the single accent touch (50% numbers, primary CTA, key highlights). Taste balance: navy base, blue-tinted light sections, yellow sparingly.
Dealt brand block (kept, printed by `start.mjs brand --page service --bg "#101D49" --ink "#EAF2F7" --accent "#F7EB4F" --type hanken --radius soft`):
`--p-bg: #101d49; --p-surface: #182751; --p-ink: #eaf2f7; --p-muted: #8694ac; --p-accent: #f7eb4f; --p-accent-ink: #101d49; --p-action: #f7eb4f; --p-action-ink: #101d49; --p-inv-bg: #eaf2f7; --p-inv-surface: #d8e2ea; --p-inv-ink: #101d49; --p-inv-muted: #536284; --p-inv-accent: #101d49; --p-inv-accent-ink: #eaf2f7; --p-inv-action: #101d49; --p-inv-action-ink: #eaf2f7; --font-display/--font-text: "Hanken Grotesk"; --display-weight: 400; --display-tracking: -0.03em; --display-tracking-xl: -0.038em.`
Substitutions (documented): the deal's first type pairing (Instrument Serif / Instrument Sans) conflicts with landing-page B1's one-typeface/no-italics rule, which the parent brief made non-negotiable — **Manrope** (single family, in B1's allowed list; Poppins is banned by taste-skill) replaces the printed Hanken Grotesk, keeping the dealt weights/tracking. Blue **#82BODB** is a custom token (orb colour, blue-tinted light grounds, blue highlights). Contrast note (verified numerically 2026-11-21 — the first estimate had the ratios backwards): blue #82BODB text is **2.33:1 on navy (fails)** but 5.70–6.14:1 on pale grounds (passes). Text on navy therefore uses the light tint **#A9D1E4** (9.99:1 on navy, 8.93:1 on panel #182751); text on light grounds is navy ink (13–14:1). #82BODB itself lives in the 3D orb + decorative scene, never in text on navy. Full pair table: mist/navy 14.33:1, muted/navy 5.29:1, yellow/navy 13.10:1, navy/yellow 13.10:1, navy/mist 14.33:1, muted-dark/mist 5.38:1, muted-dark/foam 4.99:1, yellow/panel 11.71:1, error/navy 5.81:1, navy/foam 13.30:1, darkred/#FFF5F5 9.37:1, navy/#FFF5F5 15.17:1.
Light grounds: blue-tinted **#DCEBF2** replaces cream #F5F1E8 for the pricing/risk inverse sections (keeps the dealt `--p-inv-bg: #EAF2F7` for the footer band / inverse surfaces where the deal specifies it).

### UI/UX Pro Max — fourth skill (2026-11-21)
Read in full: `~/.agents/skills/ui-ux-pro-max/SKILL.md`, `scripts/search.py`,
data (colors, typography, motion, landing, ux-guidelines, icons, styles,
products, stacks/nextjs, stacks/threejs, google-fonts) and the sibling
skills design, design-system, ui-styling, brand, banner-design, slides.
Persisted engine output `design-system/zyrix/MASTER.md` (Brutalist, pink
#EC4899, Inter + Playfair) was VERIFIED AND REJECTED — do NOT treat it as
truth and do NOT edit it. The resolved system is recorded as the page
override at `design-system/zyrix/pages/home.md` (Master + Overrides
pattern) and below. Verified fits kept: Scroll-Triggered Storytelling
pattern (landing.csv #10 — mini-CTA per chapter + final CTA, progress
indicator, DOM order complete, reduced-motion final states); Liquid
Glass translucency (styles.csv #14 — nav pill + scrims only, never dense
reading surfaces; blur 16px + saturate(1.4) + 1px highlight border);
Trust & Authority (landing.csv #33 — navy/grey corporate, trust blue,
**accent for CTA only** — yellow is CTA + 50% moments only, never body
text/eyebrows/links/decoration elsewhere); SplitText char stagger for
the hero headline only (motion.csv #9 — chars, expo.out, 400–700ms,
stagger 0.015, revert on cleanup, reduced-motion final state, plain-text
fade fallback; GSAP 3.15.1 bundles SplitText); Next.js Suspense/loading
for slow content (orb dynamic import gets a loading poster fallback);
three.js scrub:1 camera path (orb rig keeps its damped scroll progress —
equivalent, do not rewrite); Phosphor default, regular weight, size
tokens 16/20/24, no emoji icons. Rejected: Brutalism, pink palette,
black+gold palette, Inter + Playfair. No testimonials exist in
CONTENT.md — the Hero + Testimonials + CTA pattern's testimonial slot is
filled by Work (3 builds) + Promise proof; do not invent any.
Accessibility additions from ux-guidelines.csv (High/Critical): error
summary with focus on failed submit (#109); pause/play + hover/focus
pause + reduced-motion static for the brand-lockup cycler (#108); polite
atomic live region for cart counts (#118); aria-busy on submit while
sending (#78); scroll-padding-top so sticky UI never covers focus
(#100); focus ring 2px/2px offset, 3:1, yellow on navy / navy on light
(#28, #102); z-index scale nav 50 / backdrop 55 / panel 60 / gate 100 /
ring 200 (#15); touch targets ≥44px, ≥8px gaps (#22, #23, #66).
Three-layer tokens, no raw hex in components (design-system skill);
hero = one primary CTA, min 44px (banner-design skill).
**Accent discipline change from the earlier plan:** eyebrows, text links,
progress dot, nav mark ring and the orbit ring are BLUE, not yellow;
yellow stays only for the primary CTA, the 50% figures, the focus ring
on navy, and the gate line / orb glint (the single accent touch in the
scene). Eyebrows were yellow in the old theme — now blue on navy, navy
on light grounds.

### Diagnosis (redesign audit, 2026-11-21 — full codebase scan)
1. **Typography (priority 1):** three webfonts (Archivo condensed display + Schibsted Grotesk text + Instrument Serif italic) — B1 allows one. 30 italic/serif hits in 9 files (accentTitle, ClaimText, nav hover serif swap, Journey claim serifs, Risk "website." serif, Hero/Difference last-word serif). Off-scale sizes: `clamp(40px,6.4vw,92px)` h1, `clamp(28px,3vw,34px)`, `clamp(72px,22vw,320px)` wordmark, `text-[11px]` ×3, `font-size:11px` inline ×4, `text-[0.5em]`, `h-[108px]`. ui-monospace micro-labels = a second typeface family (B1: one typeface). Display weight 700 in the wordmark (cap is semibold/bold — 700 is bold, allowed).
2. **Color/surfaces (priority 2):** whole palette changes black/gold → navy/blue/yellow. Radial-gradient scrim (`.scrim::before`) + radial-gradient CSS orb fallback — B4 flat surfaces only; replace with flat translucent + backdrop-blur. No grain/noise on flat surfaces — add a subtle static noise layer. No shadows (good); tinted shadows where added, one light direction.
3. **Hover/active/focus (priority 3):** focus ring is gold — recolor yellow; buttons use gold flood hover — recolor yellow; nav hover swaps to serif — remove. Active nav item is not indicated — add (B9).
4. **Layout/spacing (priority 4):** Services 2-col ×4 equal cards, Work 3 equal columns, Pricing 4 equal cards — the generic AI layout; restructure asymmetrically (see below). FAQ is an accordion — change to side-by-side list / inline progressive disclosure. `height:100vh` — already compliant (code uses `100svh`). Max-width container — already compliant (`.wrap` min(100% - 160px, 1280px)). Off-token spacing: 120px section padding, py-5 (20px), mt-5/mb-5 (20px), gap-14 (56px), py-2.5 (10px), p-5 (20px) — snap to the B2 token table. Radii: `--radius-lg: 20px` is not a Tailwind value — snap to 16px (rounded-2xl). Pricing lists start at the same Y — keep fixed-height header blocks. Card CTAs bottom-aligned — keep `mt-auto`. z-index scale: 50/55/60/100/200 in use — document as the scale. Body measure 62ch ✓ (~65ch). Prices not tabular-nums — enable `font-variant-numeric: tabular-nums`.
5. **Motion (priority 5):** reveals rise 24px, ease power3 — B7 wants rise 32px + fade 600–800ms once, base curve cubic-bezier(0.22,1,0.36,1) (GSAP equivalent: expo.out). Word masks keep blur+rise (the suspense the user praised) re-eased to the base curve. Mobile menu links stagger 80ms steps — B7 wants 60ms, capped at 400ms. Menu toggle does not morph — make the hamburger animate to an X. Nav is a fixed opaque full-width bar — B7 wants a floating compact bar with blur. Gate lift uses (0.76,0,0.24,1) — re-ease to the base curve.
6. **Generic components (priority 6):** hand-drawn TierIcons/Risk CardIcons — replace with Phosphor icons (`@phosphor-icons/react` 2.1.10). Services/Work/Pricing equal grids — see §4.
7. **Loading/empty/error (priority 7):** form has sending/sent/error states ✓ (keep). No async content besides the form; hero 3D has the CSS fallback poster ✓. Missing: branded 404 (B10) — add `not-found.tsx`. Missing: privacy + terms links in footer (B10) — add minimal `/privacy` and `/terms` pages (honest, factual copy only) and link them.
8. **Copy (priority 8):** all client copy stays EXACT (CONTENT.md). New/derived copy only: sentence case, no hyphens, verb + what-they-get CTAs ("Get free plan" already does this — keep). B11 tagline reveal: "Same standard. Half the rate." as its own mid-page moment — implemented as the Promise head (its own moment, words 30% → full colour in reading order on the base curve, reduced-motion shows final text immediately).
9. **Type scale (priority 9):** snap every size to the Tailwind scale, closest step below — h1 92px → text-7xl 72px (desktop) / text-5xl 48px (phone); h2 64px → text-6xl 60px / text-4xl 36px; h3 28px → text-2xl 24px; body 16px = text-base ✓; labels 13px → text-xs 12px; named text styles heading-1..caption-5 as reusable classes in globals.css (see below).

### Part A outputs (landing-page skill)
- **Page outline + section order:** hero → difference (problem) → result (pitch) → promise (B11 tagline + 50% proof) → services (benefits, 4, asymmetric) → journey (how it works, 4 steps) → work (proof, 3 builds) → pricing (4 tiers, Business emphasized) → risk (risk reversal) → FAQ (5, side-by-side) → contact (final CTA) → footer.
- **Hero copy (exact, from CONTENT.md):** headline "Premium websites at half the 2026 market rate."; subheadline "Built for Sri Lankan businesses."; CTAs "See the 50% difference" (scroll) / "Free website plan" (primary); proof on screen 1: "from LKR 15,000" + the 50% rate (hard fact in the h1). One offer, one audience, one primary action: the free plan.
- **Benefits (3–5, outcome-driven, from CONTENT.md):** Be trusted (an established online presence); Make buying easy (fast local checkout, LKR 75,000 tier); Make work simple (WhatsApp ordering, bookings, live dashboards); Be remembered (scroll stories, mobile speed); plus the Difference (no vague prices, no slow delivery, no unclear ownership).
- **How it works:** the journey has 4 steps from CONTENT.md (Discover, Trust, Message, Pay) — kept exact; the skill's 3-step guidance is noted but CONTENT.md is the source of truth.
- **FAQ:** the site's 5 Q&As stay — the skill wants 6–12, but CONTENT.md is the source of truth; do not invent questions.
- **SEO/AEO:** index (evergreen page); title "Zyrix® | Web Design Sri Lanka from LKR 15,000"; meta description as set in layout.tsx; FAQ in plain Q&A form (the side-by-side list keeps plain Q&A markup — good for AEO); add JSON-LD FAQPage schema.
- **Layout recommendation:** **A (classic hero plus sections)** — the offer is understandable from the hero + orb; the hero's 3D visual carries the product.
- **B11 tagline reveal:** "Same standard. Half the rate." — Promise head, words 30% → full colour in reading order on the base curve.

### Implementation order (A6 — section by section, never a whole-page rewrite per iteration)
1. Global systems: tokens (`@theme`: --color-navy #101D49, --color-blue #82BODB, --color-accent #F7EB4F, --color-mist #EAF2F7, --color-foam #DCEBF2, --color-panel #182751, --color-muted #8694AC), Manrope single family, named text styles heading-1..caption-5, spacing token snap, radii snap, buttons (padding 8px 12px, min-height 44px, yellow flood), focus ring yellow, z-index scale, noise layer, scrims flat + backdrop-blur, B4 gradient removal, favicon recolour, JSON-LD FAQ schema.
2. Orb recolour (dusty-blue liquid metal, yellow glint Lightformers, yellow orbit ring, blue dust) + CSS fallback poster recolour (flat border ring, no gradient).
3. Gate restyle (navy curtain, yellow line, Manrope letters, base-curve lift).
4. Nav → floating compact pill with blur; toggle morphs hamburger ↔ X; mobile menu stagger 60ms; active nav item indicated.
5. RevealRig re-ease (rise 32px, 0.7s, expo.out ≈ base curve), word masks keep blur+rise.
6. Hero: h1 solid mist #EAF2F7 (14.33:1), max-width 680px, meaningful breaks; remove serif last word. (The B5 white → #A9D1E4 text gradient was removed 2026-11-21: background-clip:text does not paint on the h1 in the verification browser — the headline was invisible — while a fresh gradient div on the same page paints fine, so the h1's compositing context over the live WebGL canvas is the trigger. Solid mist matches the motion pass.)
7. Difference → Result → Promise (B11 TaglineReveal) → Services (asymmetric 12-col: spans 7/5/5/7, mocks kept) → Journey → Work (asymmetric 12-col: 7/5/full-width horizontal) → Pricing (asymmetric rows: Business + Starter / Commerce + Custom, Business emphasized by colour/weight, "The 50% benchmark" tag, lists start at same Y, tabular-nums) → Risk (Phosphor icons) → FAQ (side-by-side list + inline disclosure) → Contact → Footer (privacy + terms links) → not-found.tsx, /privacy, /terms.
8. Remove dead code (serif-accent, font-serif, Instrument/Archivo/Schibsted imports, display--sentence, hand-drawn icons) and import hallucinations; `npx eslint` + `npx tsc --noEmit` clean.
9. Verify (done 2026-11-21): `npm run build` passes; `npx tsc --noEmit` and `npx eslint` clean; Playwright headless-shell full theme check **37/37** at 1440×900 and 390×844 (gate lifts, theme tokens, h1 solid mist, nav blur, char stagger, all h2 reveals, B11 tagline one-at-a-time, pricing spans, FAQ side-by-side, footer legal links, orb veil, mobile menu stagger + Escape, form → WhatsApp fallback, reduced-motion, /privacy, /terms, 404, zero console/page errors, no overflow). Orb pixel-verified blue (B-R +117). Pre-delivery checklist — see item 12. Commit locally only; do NOT push (parent handles push/deploy).
10. Build fixes found 2026-11-21 (both fixed, build green): (a) `@phosphor-icons/react` calls `createContext` at module scope (its `IconContext`) and ships a CSR entry that is not SSR-safe — importing it from a server component breaks `next build` with `TypeError: (0, i.createContext) is not a function` at page evaluation. Fix: `"use client";` at the top of Difference.tsx, Pricing.tsx and Risk.tsx (the three static sections that import Phosphor; Faq/Services/Work were already client). Rule going forward: **any file importing @phosphor-icons/react must be a client component.** (b) Contrast: the first estimate had the blue ratios backwards — #82BODB text is 2.33:1 on navy, not ~6.7:1. All blue text on navy/panel is now the light tint #A9D1E4 (9.99:1 on navy); the hero gradient end is #A9D1E4; #82BODB lives in the orb + decorative scene only. Verified numerically (see Theme decision above).
11. Visual fixes found in the browser check 2026-11-21 (all fixed, re-verified): (a) **H1 invisible** — the B5 text gradient (background-clip:text) does not paint on the hero h1 in the verification browser (headline invisible; solid colour paints fine; a fresh gradient div on the same page paints fine; removing the char spans, transforms, scrim and isolation did not restore it — the h1's compositing context over the live WebGL canvas is the trigger). Fix: h1 is solid mist #EAF2F7 (14.33:1), `.hero-gradient` rule deleted. (b) **Orb would not read as blue** — it went black (metalness 1 mirror, front face reflecting dark space), then chrome/silver (front blue Lightformer), then grey-white through metalness 1→0.1, roughness, envMapIntensity, emissive, ambient and Lightformer-intensity changes. Root cause: the pale #82BODB albedo is too desaturated to survive ACES tone mapping + bright lighting (the gold orb survived only because gold is extremely saturated). Fix: explicit directional lights, NO drei Environment map (its reflections washed the albedo out), and a saturated render albedo **TORUS_ALBEDO #2F7FB8** (steel blue, chosen so the on-screen result matches dusty blue #82BODB after lighting + tone mapping); the pale #82BODB stays for dust, orbit ring and all 2D UI, where it renders exactly. MeshDistortMaterial (liquid wobble) restored with the saturated albedo — verified blue. (c) **Lightning CSS prefix order** — `backdrop-filter` written before `-webkit-backdrop-filter` was dropped from the build (Lightning keeps the last declaration for the same logical property), so the nav pill and scrims had no blur. Fix: prefixed first, standard last, in `.nav` and `.scrim::before`.
12. Pre-delivery checklist (ui-ux-pro-max Quick Reference §1–3, final review 2026-11-21 — all verified unless noted): No emoji icons; Phosphor only (regular weight; 16/20/24/40px tokens). Semantic tokens everywhere — grep for raw hex in `src/components/` + `src/app/` returns only the WhatsAppFloat dots (now `fill="var(--p-accent)"`) and `themeColor: "#101d49"` in layout metadata (browser chrome, not a component style); the orb's `TORUS_ALBEDO`/`BLUE`/`BLUE_LIGHT`/`YELLOW_GLINT` are primitive constants defined once in the scene file. Decorative icons aria-hidden (TierIcon/CardIcon share a props object with `"aria-hidden": true`; Faq Plus and mini-CTA ArrowRights have `aria-hidden="true"`; WhatsApp SVG is aria-hidden, the link has an aria-label). Icon controls have accessible names + state (menu toggle, Play aria-pressed, cart qty buttons). Pressed states scale(0.98) only — no layout shift. Touch targets ≥44px (buttons 44px min, menu toggle, qty buttons, FAQ rows min-h-11, footer legal links tap44), gaps ≥8px. Contrast ≥4.5:1 both grounds (verified numerically): mist/navy 14.33, muted/navy 5.29, yellow/navy 13.10, navy/mist 14.33, muted-dark/mist 5.38, muted-dark/foam 4.99, blue-light/navy 9.99, error/navy 5.81. Form: labels + hints + inline errors; error summary verified in the browser (empty submit → "There is a problem" appears, focus moves to the summary DIV role="alert", its links focus the matching fields; `work/err-test.mjs`); submit button aria-busy while sending; cart changes announced via polite atomic role="status" live regions (Services mini-cart, FORM shop). Colour is not the only indicator (active nav dot + aria-current; FAQ colour + aria-expanded + rotated Plus; form errors text + summary). Sticky UI never obscures focus (`scroll-padding-top: var(--nav)`; skip link lands below the floating pill; focus ring 2px/2px offset, 3:1, yellow on navy / navy on light). Scrim measured against the real background (orb veil + flat translucent scrims; grain 0.04). Small phone verified (390×844); desktop 1440×900 verified. **Phone landscape (844×390) not explicitly tested** — the 1440×900 desktop check covers wide viewports and the layout is responsive; minor open item, not a blocker. Reduced-motion verified. Z-index scale: nav 50 / menu backdrop 55 / menu panel 60 / gate 100 / ring 200 / WhatsApp float 40.


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
