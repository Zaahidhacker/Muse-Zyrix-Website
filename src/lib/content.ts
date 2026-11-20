/**
 * Zyrix — every word on the page, transcribed from the live site.
 * Source of truth: CONTENT.md (2026-11-20). Do not edit a string here
 * without editing CONTENT.md first. No invented copy lives in this file.
 */

export const CONTACT = {
  whatsappDisplay: "+94 72 055 1707",
  whatsappUrl: "https://wa.me/94720551707",
  tel: "tel:+94720551707",
  emailDisplay: "zyrix.co@outlook.com",
  emailUpper: "ZYRIX.CO@OUTLOOK.COM",
  emailUrl: "mailto:zyrix.co@outlook.com",
  location: "Colombo, Sri Lanka / Worldwide",
} as const;

export const NAV = {
  links: [
    { label: "50% RATE", href: "#promise" },
    { label: "SERVICES", href: "#services" },
    { label: "WORK", href: "#work" },
    { label: "PRICING", href: "#pricing" },
    { label: "CONTACT", href: "#contact" },
  ],
  cta: "START AT 15K",
  ctaHref: "#pricing",
} as const;

export const HERO = {
  eyebrow: "INDEPENDENT DIGITAL STUDIO",
  continuum: "THE CONTINUUM — IDEAS IN MOTION",
  wordmark: "ZYRIX",
  h1: "Premium websites at half the 2026 market rate.",
  sub: "Built for Sri Lankan businesses.",
  primary: "See the 50% difference",
  primaryHref: "#promise",
  secondary: "Free website plan",
  secondaryHref: "#contact",
  scroll: "SCROLL TO DIRECT",
  live: "ZYRIX.BUILD / LIVE",
  nextSite: "YOUR NEXT SITE®",
  disciplines: "DESIGN / MOTION / CODE",
  flow: "STRATEGY → DESIGN → MOTION → CODE",
} as const;

export const DIFFERENCE = {
  index: "01",
  eyebrow: "THE DIFFERENCE",
  h2: "NOT ANOTHER PRETTY PAGE.",
  body: "We removed the usual reasons businesses delay a website: vague prices, slow delivery and unclear ownership.",
} as const;

export const RESULT = {
  index: "02",
  eyebrow: "THE RESULT",
  h2: "WE BUILD MOMENTUM.",
  body: "Attention. Desire. Action. Nothing extra.",
  meta: "INTRO / 04 ACTS / OUR ENTIRE PITCH / 11 WORDS",
  pitch: "Strategy earns attention. Design creates desire. Motion turns interest into action.",
} as const;

export const PROMISE = {
  eyebrow: "THE 50% PROMISE",
  h2: "Same standard. Half the rate.",
  note: "NO HIDDEN FEES",
  marketLabel: "Typical 5-page site, market 2026",
  marketPrice: 60000,
  zyrixPrice: 30000,
  zyrixLine: "Zyrix Business: exactly 50% — 30,000 LKR",
  zyrixIncludes: "custom design · mobile · SEO · WhatsApp",
  rows: [
    { name: "LANDING", zyrix: "15K", market: "Market 30K" },
    { name: "BUSINESS", zyrix: "30K", market: "Market 60K" },
    { name: "COMMERCE", zyrix: "75K", market: "Market 150K" },
    { name: "CUSTOM", zyrix: "150K+", market: "Market 300K+" },
  ],
  split: "50% TO START · 50% ON DELIVERY",
  seePlans: "See every plan ↗",
  seePlansHref: "#pricing",
} as const;

export const SERVICES = {
  index: "04",
  eyebrow: "CAPABILITIES",
  h2: "Capabilities.",
  items: [
    {
      n: "01",
      title: "BRAND + WEB",
      claim: "Be trusted.",
      body: "A sharp, mobile-first presence that makes your business feel established.",
      tags: ["STRATEGY", "UI·UX", "SEO-READY CODE"],
      visual: { kind: "IDENTITY / 001", lines: ["Z.", "DIFFERENT ON PURPOSE.", "ZYRIX®", "BRAND SYSTEMS", "LOOK ALIVE."] },
    },
    {
      n: "02",
      title: "E-COMMERCE",
      claim: "Make buying easy.",
      body: "Fast local checkout with PayHere, LankaQR and the payment paths your customers use.",
      tags: ["CATALOG", "LOCAL PAYMENTS", "ORDERS"],
      visual: { kind: "OBJECTS® / SHOP" },
    },
    {
      n: "03",
      title: "DIGITAL SYSTEMS",
      claim: "Make work simple.",
      body: "WhatsApp ordering, bookings and dashboards built around your actual workflow.",
      tags: ["WHATSAPP", "BACKEND", "AUTOMATION"],
      visual: { kind: "Operations / LIVE WORKSPACE" },
    },
    {
      n: "04",
      title: "MOTION",
      claim: "Be remembered.",
      body: "Scroll stories that hold attention—without sacrificing mobile speed.",
      tags: ["DIRECTION", "3D", "PERFORMANCE"],
      visual: { kind: "MOVE / MOTION DIRECTION®", lines: ["SCROLL", "HOVER", "FEEL"] },
    },
  ],
} as const;

export const JOURNEY = {
  eyebrow: "SRI LANKA / CUSTOMER JOURNEY 2026",
  h2: "From discovery to payment.",
  stats: "13.9M ONLINE / MOBILE + WHATSAPP FIRST",
  steps: [
    {
      n: "01",
      title: "DISCOVER",
      claim: "Get found.",
      body: "SEO-ready structure for Google, social campaigns and local search.",
      visual: {
        search: "best service in colombo ×",
        labels: "SPONSORED + ORGANIC",
        line: "Your business, found first.",
        sub: "Fast pages. Clear services. Local search structure.",
        tags: ["SEO", "SCHEMA", "ANALYTICS"],
      },
    },
    {
      n: "02",
      title: "TRUST",
      claim: "Feel credible.",
      body: "A fast mobile experience, clear proof and no confusion about what you offer.",
      visual: { label: "MOBILE PERFORMANCE", score: "98", words: ["FAST", "CLEAR", "TRUSTED"], line: "Designed for the phone already in your customer's hand." },
    },
    {
      n: "03",
      title: "MESSAGE",
      claim: "Start talking.",
      body: "One-tap WhatsApp enquiries with the right context already filled in.",
      visual: {
        business: "Your Business",
        response: "REPLIES WITHIN 24 HOURS",
        incoming: "Hi! I'd like a quote for the service I just viewed.",
        outgoing: "Perfect—your website already sent us the details. Let's help.",
        placeholder: "MESSAGE YOUR BUSINESS…",
      },
    },
    {
      n: "04",
      title: "PAY",
      claim: "Close the sale.",
      body: "PayHere, LankaQR, cards or bank transfer—matched to your customers.",
      visual: { label: "SECURE CHECKOUT", currency: "LKR", line: "Choose how you pay.", methods: ["PAYHERE", "LANKAQR", "CARDS", "BANK TRANSFER"] },
    },
  ],
} as const;

export const WORK = {
  eyebrow: "WHAT WE SHIP",
  h2: "What we build",
  meta: "INTERACTIVE BUILDS / 03",
  items: [
    {
      n: "01",
      title: "RESTAURANT ORDERING",
      claim: "Menu to message.",
      tags: ["DIGITAL MENU", "WHATSAPP ORDERS", "DASHBOARD"],
      mock: {
        kitchen: "KITCHEN / LIVE",
        name: "Koti's",
        sub: "MODERN SRI LANKAN KITCHEN",
        menu: [
          { name: "String hoppers", price: 350 },
          { name: "Kottu royale", price: 650 },
          { name: "Curd pudding", price: 450 },
        ],
        orderNow: "ORDER NOW →",
        ordersLive: "ORDERS ● LIVE",
        orderNo: "#128",
        counts: [
          { label: "NEW", value: 8 },
          { label: "COOK", value: 4 },
          { label: "DONE", value: 16 },
        ],
      },
    },
    {
      n: "02",
      title: "E-COMMERCE",
      claim: "Browse. Buy. Done.",
      tags: ["CATALOG", "PAYMENTS", "INVENTORY"],
      mock: {
        brand: "FORM® OBJECTS",
        nav: ["SHOP", "JOURNAL", "CART (1)"],
        objectNo: "OBJECT NO. 04",
        category: "SCULPTED ESSENTIALS",
        name: "The form lamp.",
        line: "Quiet light. Loud shape.",
        price: 24900,
        addToCart: "ADD TO CART +",
      },
    },
    {
      n: "03",
      title: "BUSINESS + BRAND",
      claim: "Look established.",
      tags: ["POSITIONING", "WEBSITE", "SEO"],
      mock: {
        label: "CORPORATE / REFRAMED",
        line: "Built for what's next.",
        cta: "EXPLORE THE COMPANY →",
      },
    },
  ],
} as const;

export const PRICING = {
  eyebrow: "CLEAR PRICING",
  h2: "Half the market.",
  meta: "04",
  tiers: [
    {
      n: "01",
      kind: "ONE-PAGE WEBSITE",
      name: "Starter",
      price: 15000,
      unit: "LKR",
      period: "ONE-TIME",
      market: "MARKET 30,000 LKR / ZYRIX IS 50%",
      included: ["Custom mobile-first design", "SEO foundation", "WhatsApp lead flow"],
      delivery: "5 days",
    },
    {
      n: "02",
      kind: "FIVE-PAGE WEBSITE",
      name: "Business",
      price: 30000,
      unit: "LKR",
      period: "ONE-TIME",
      market: "MARKET 60,000 LKR / ZYRIX IS 50%",
      included: ["Five-page architecture", "Interactions + analytics", "Page-level local SEO"],
      delivery: "7–10 days",
    },
    {
      n: "03",
      kind: "ONLINE STORE",
      name: "Commerce",
      price: 75000,
      unit: "LKR",
      period: "ONE-TIME",
      market: "MARKET 150,000 LKR / ZYRIX IS 50%",
      included: ["Products + inventory", "PayHere / LankaQR / cards", "Orders + admin dashboard"],
      delivery: "10–14 days",
    },
    {
      n: "04",
      kind: "ORDERING + WEB APPS",
      name: "Custom",
      price: 150000,
      priceSuffix: "+",
      unit: "LKR",
      period: "ONE-TIME",
      market: "MARKET 300,000+ LKR / ZYRIX IS 50%",
      included: ["Ordering or booking flow", "Backend + dashboard", "30-day support"],
      delivery: "Scoped",
    },
  ],
  footerSplit: "50% TO START / 50% ON DELIVERY",
  footerCta: "Start a project",
  footerCtaHref: "#contact",
} as const;

export const RISK = {
  h2: "Less risk. More website.",
  body: "We removed the usual reasons businesses delay a website: vague prices, slow delivery and unclear ownership.",
  cards: [
    { title: "Fixed before we start", body: "One scope. One price. No surprise invoice at launch." },
    { title: "You own the result", body: "Your design, content and production code are handed over to you." },
    { title: "Built to perform", body: "Mobile speed, technical SEO and analytics are part of the build—not add-ons." },
    { title: "Local where it matters", body: "WhatsApp, LKR pricing, local payments and trilingual structure when needed." },
  ],
} as const;

export const FAQ = {
  eyebrow: "STRAIGHT ANSWERS",
  h2: "Ask us anything",
  meta: "05 / No fine print.",
  items: [
    {
      q: "Is the listed price really final?",
      a: "Yes—for the agreed scope. Before work starts, you receive a clear list of pages, features, timeline and total. Domain, hosting or paid third-party tools are shown separately at cost.",
    },
    {
      q: "What do you need from me?",
      a: "Your goal, business details, preferred style and any existing logo or content. If your content is not ready, we help structure what each page needs before design begins.",
    },
    {
      q: "How does payment work?",
      a: "50% confirms the project and starts design. The remaining 50% is due after approval, before final launch and handover.",
    },
    {
      q: "Can you build in Sinhala or Tamil?",
      a: "Yes. We can structure English, Sinhala and Tamil experiences. Translation copy can be supplied by you or scoped separately with the project.",
    },
    {
      q: "What happens after launch?",
      a: "Every project includes handover and a defined support period. Commerce includes priority support; custom systems include 30 days. Ongoing help is optional, never forced.",
    },
  ],
} as const;

export const CONTACT_SECTION = {
  eyebrow: "LET'S MAKE IT REAL",
  h2: "Get your free plan.",
  meta: "FREE PROJECT PLAN / 24-HOUR RESPONSE",
  body: "Tell us what you sell and who you need to reach. We reply with the right package, timeline and next step—without a sales pitch.",
  channels: [
    { label: "WHATSAPP", value: "+94 72 055 1707 ↗", href: "https://wa.me/94720551707" },
    { label: "EMAIL", value: "ZYRIX.CO@OUTLOOK.COM ↗", href: "mailto:zyrix.co@outlook.com" },
    { label: "COLOMBO, SRI LANKA / WORLDWIDE", value: "", href: "" },
  ],
  form: {
    nameLabel: "NAME",
    emailLabel: "EMAIL",
    projectLabel: "WHAT ARE WE MAKING? / Choose a project",
    projectOptions: [
      "Starter — one-page website",
      "Business — five-page website",
      "Commerce — online store",
      "Custom — ordering / web app",
      "Not sure yet",
    ],
    detailsLabel: "THE SHORT VERSION",
    detailsPlaceholder: "Your goal, deadline, anything useful",
    submit: "Get free plan",
    note: "NO PITCH DECK. NO PRESSURE.",
    sending: "Sending…",
    sent: "Your free plan request is in. We reply within 24 hours.",
    error: "Something went wrong. Try WhatsApp instead.",
  },
} as const;

export const FOOTER = {
  wordmark: "ZYRIX",
  studio: "INDEPENDENT DIGITAL STUDIO / COLOMBO / WORLDWIDE",
  links: [
    { label: "CALL", href: "tel:+94720551707" },
    { label: "WHATSAPP", href: "https://wa.me/94720551707" },
    { label: "EMAIL", href: "mailto:zyrix.co@outlook.com" },
  ],
  legal: "© 2026 ZYRIX®",
  tagline: "MAKE THE WEB MOVE.",
} as const;

export function formatLkr(n: number): string {
  return n.toLocaleString("en-LK");
}
