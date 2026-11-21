/**
 * Theme + quality verification for the Zyrix redesign (2026-11-21).
 * Runs against the production build (npm run start, port 3000).
 * Usage: node work/zyrix-theme-check.mjs
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire("/home/hatch/workspace/chat-website/package.json");
const { chromium } = require("playwright-core");

const SHELL =
  "/home/hatch/.pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell";
const BASE = "http://127.0.0.1:3000";
const OUT = new URL("./shots-theme/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch({ executablePath: SHELL, args: ["--no-sandbox"] });

async function newPage(width, height, extra = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    ...extra,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return { ctx, page, errors };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------- Desktop 1440x900 ----------------
{
  const { ctx, page, errors } = await newPage(1440, 900);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const gateAtLoad = await page.locator("[data-gate]").count();
  let gateGone = false;
  try {
    await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 10000 });
    gateGone = true;
  } catch {
    gateGone = false;
  }
  check("gate: present at load, lifts and unmounts", gateAtLoad === 1 && gateGone, `at load=${gateAtLoad} gone=${gateGone}`);
  await page.waitForLoadState("networkidle");

  // Theme tokens — computed styles on the live page
  const theme = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const eyebrow = document.querySelector(".eyebrow");
    const primary = document.querySelector(".btn--primary");
    const h1 = document.querySelector("h1");
    const nav = document.querySelector(".nav");
    const cs = (el, prop) => (el ? getComputedStyle(el)[prop] : "n/a");
    return {
      bodyBg: body.backgroundColor,
      eyebrow: cs(eyebrow, "color"),
      primaryBg: cs(primary, "backgroundColor"),
      primaryColor: cs(primary, "color"),
      h1Color: cs(h1, "color"),
      navBackdrop: cs(nav, "backdropFilter"),
      h1Text: h1 ? h1.textContent.replace(/\s+/g, " ").trim() : "",
      h1Br: h1 ? h1.querySelectorAll("br").length : 0,
      chars: h1 ? h1.querySelectorAll(".rc-i").length : 0,
      orbCanvas: !!document.querySelector("canvas"),
      orbFallback: !!document.querySelector(".orb-fallback"),
      scrollW: document.documentElement.scrollWidth,
    };
  });
  check("theme: body ground is navy #101D49", theme.bodyBg === "rgb(16, 29, 73)", `bg=${theme.bodyBg}`);
  check("theme: eyebrow is blue-light #A9D1E4", theme.eyebrow === "rgb(169, 209, 228)", `color=${theme.eyebrow}`);
  check("theme: primary CTA is yellow #F7EB4F with navy text", theme.primaryBg === "rgb(247, 235, 79)" && theme.primaryColor === "rgb(16, 29, 73)", `bg=${theme.primaryBg} color=${theme.primaryColor}`);
  check("theme: h1 is solid mist #EAF2F7 (14.33:1; gradient removed — background-clip:text does not paint on the h1 over the live canvas)", theme.h1Color === "rgb(234, 242, 247)", `color=${theme.h1Color}`);
  check("theme: floating nav pill has Liquid Glass blur", /blur\(16px\)/.test(theme.navBackdrop), `backdrop=${theme.navBackdrop}`);
  check("hero: h1 char-split, <br> kept, accessible name intact", theme.chars >= 20 && theme.h1Br === 1 && /premium/i.test(theme.h1Text) && /market rate/i.test(theme.h1Text), `chars=${theme.chars} br=${theme.h1Br} text=${theme.h1Text.slice(0, 50)}`);
  check("hero: orb canvas or CSS fallback poster present", theme.orbCanvas || theme.orbFallback, `canvas=${theme.orbCanvas} fallback=${theme.orbFallback}`);
  check("desktop: no horizontal overflow", theme.scrollW <= 1440, `scrollWidth=${theme.scrollW}`);

  // Hero chars settled
  const heroLastOp = await page.locator("h1 .rc-i").last().evaluate((el) => getComputedStyle(el).opacity);
  check("hero: char stagger settled (last char opacity 1)", heroLastOp === "1", `opacity=${heroLastOp}`);
  await page.screenshot({ path: path.join(OUT, "1440-hero.png") });

  // Scroll through sections, screenshot each, verify h2 split + settled.
  // #promise has no h2 .rv-i — its heading IS the B11 tagline
  // (.tagline-word), verified separately below.
  const sections = ["difference", "result", "services", "journey", "work", "pricing", "risk", "faq", "contact"];
  for (const id of sections) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await sleep(1100);
    await page.screenshot({ path: path.join(OUT, `1440-${id}.png`) });
    const info = await page.evaluate((sid) => {
      const sec = document.getElementById(sid);
      const h2 = sec?.querySelector("h2");
      const words = h2?.querySelectorAll(".rv-i") ?? [];
      const last = words[words.length - 1];
      return {
        words: words.length,
        settled: last ? getComputedStyle(last).opacity : "n/a",
      };
    }, id);
    check(`section #${id}: h2 words split + settled`, info.words >= 1 && info.settled === "1", `words=${info.words} opacity=${info.settled}`);
  }

  // B11 tagline: words activate one at a time. The reveal fires once,
  // so this runs on a FRESH load (the section loop above already
  // triggered it once). Scroll straight to #promise and sample the
  // count of fully-opaque words at 60ms intervals; it must climb in
  // steps, not jump to all at once. The inline transition-delays
  // (0/120/240/360/480ms) prove the stagger is wired.
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  try {
    await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 10000 });
  } catch {
    // fall through: the tagline check below will surface a stuck gate
  }
  await page.waitForLoadState("networkidle");
  const tagDelays = await page.evaluate(() =>
    [...document.querySelectorAll(".tagline-word")].map((w) => getComputedStyle(w).transitionDelay),
  );
  await page.evaluate(() => document.getElementById("promise")?.scrollIntoView({ behavior: "instant", block: "start" }));
  const taglineSeries = [];
  for (let i = 0; i < 22; i++) {
    const n = await page.evaluate(() => {
      const words = document.querySelectorAll(".tagline-word");
      let full = 0;
      words.forEach((w) => {
        if (Number(getComputedStyle(w).opacity) > 0.9) full++;
      });
      return { total: words.length, full };
    });
    taglineSeries.push(n.full);
    await sleep(60);
  }
  const tagTotal = await page.evaluate(() => document.querySelectorAll(".tagline-word").length);
  const distinct = [...new Set(taglineSeries)];
  const monotonic = taglineSeries.every((v, i) => i === 0 || v >= taglineSeries[i - 1]);
  const stepped = distinct.length >= 3 && taglineSeries[taglineSeries.length - 1] === tagTotal;
  check("B11 tagline: words activate one at a time, then all full", tagTotal === 5 && monotonic && stepped && tagDelays.join(",") === "0s,0.12s,0.24s,0.36s,0.48s", `total=${tagTotal} delays=${tagDelays.join(",")} series=${taglineSeries.join(",")}`);
  await page.screenshot({ path: path.join(OUT, "1440-tagline.png") });

  // Pricing asymmetric grid: distinct column spans across the 4 tiers
  const pricingSpans = await page.evaluate(() => {
    return [...document.querySelectorAll("#pricing .grid > *")].slice(0, 4).map((el) => {
      const cs = getComputedStyle(el);
      return `${cs.gridColumnStart}/${cs.gridColumnEnd}`;
    });
  });
  check("pricing: asymmetric 12-col grid (distinct spans)", new Set(pricingSpans).size >= 2, `spans=${pricingSpans.join(" | ")}`);

  // FAQ side-by-side list: click a question, panel shows its answer,
  // active question turns blue-light
  await page.evaluate(() => document.getElementById("faq")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await sleep(900);
  const faqBtns = page.locator("#faq [aria-controls='faq-panel']");
  const faqCount = await faqBtns.count();
  await faqBtns.nth(1).click();
  await sleep(500);
  const faq = await page.evaluate(() => {
    const panel = document.getElementById("faq-panel");
    const active = document.querySelector("#faq [aria-controls='faq-panel'][aria-expanded='true'] span");
    return {
      panelText: panel ? panel.textContent.replace(/\s+/g, " ").trim().slice(0, 80) : "",
      activeColor: active ? getComputedStyle(active).color : "n/a",
    };
  });
  check("faq: side-by-side list, click shows answer, active is blue-light", faqCount === 5 && faq.panelText.length > 20 && faq.activeColor === "rgb(169, 209, 228)", `questions=${faqCount} active=${faq.activeColor} panel=${faq.panelText.slice(0, 40)}`);

  // Footer: privacy + terms links present, wordmark visible
  await page.evaluate(() => document.getElementById("footer")?.scrollIntoView({ behavior: "instant" }));
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT, "1440-footer.png") });
  const legal = await page.evaluate(() => ({
    privacy: !!document.querySelector('a[href="/privacy"]'),
    terms: !!document.querySelector('a[href="/terms"]'),
    wordmark: !!document.querySelector("#footer [aria-label='Zyrix']"),
  }));
  check("footer: privacy + terms links, wordmark", legal.privacy && legal.terms && legal.wordmark, JSON.stringify(legal));

  // Orb veil: dimmed while a dark section is centred
  await page.evaluate(() => document.getElementById("result")?.scrollIntoView({ behavior: "instant", block: "center" }));
  await sleep(900);
  const dimAtResult = await page.evaluate(() => document.documentElement.dataset.orbDim);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(900);
  const dimAtTop = await page.evaluate(() => document.documentElement.dataset.orbDim);
  check("orb veil: dimmed over text sections, clear at hero", dimAtResult === "1" && dimAtTop !== "1", `result=${dimAtResult} top=${dimAtTop}`);

  check("desktop: no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------------- Phone 390x844 ----------------
{
  const { ctx, page, errors } = await newPage(390, 844, { hasTouch: true, isMobile: true });
  await page.goto(BASE, { waitUntil: "networkidle" });
  try {
    await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 10000 });
  } catch {
    // fall through: the hero checks below will surface a stuck gate
  }
  await sleep(800);

  const phone = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    heroH: document.getElementById("top")?.getBoundingClientRect().height,
    h1Size: getComputedStyle(document.querySelector("h1")).fontSize,
  }));
  check("phone: no horizontal overflow", phone.scrollW <= 390, `scrollWidth=${phone.scrollW}`);
  check("phone: hero h1 is 48px (text-5xl)", phone.h1Size === "48px", `fontSize=${phone.h1Size} heroH=${Math.round(phone.heroH ?? 0)}`);
  await page.screenshot({ path: path.join(OUT, "390-hero.png") });

  // Mobile menu: opens, links stagger 60ms apart (60..300), closes
  await page.locator('button[aria-label="Menu"]').click();
  await sleep(700);
  const menu = await page.locator("#mobile-menu").evaluate((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const delays = [...el.querySelectorAll(".menu-link")].map((l) => getComputedStyle(l).animationDelay);
    return { x: Math.round(r.x), visible: cs.visibility, delays };
  });
  check("mobile menu: slides in, links stagger 60ms", menu.visible === "visible" && menu.x >= 0 && menu.x < 390 && menu.delays.join(",") === "0.06s,0.12s,0.18s,0.24s,0.3s", `x=${menu.x} delays=${menu.delays.join(",")}`);
  await page.screenshot({ path: path.join(OUT, "390-menu.png") });
  await page.keyboard.press("Escape");
  await sleep(700);
  const menuClosed = await page.locator("#mobile-menu").evaluate((el) => getComputedStyle(el).visibility);
  check("mobile menu: Escape closes it", menuClosed === "hidden", `visibility=${menuClosed}`);

  // Scroll sections on phone, screenshot promise + services + pricing
  for (const id of ["promise", "services", "pricing"]) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await sleep(1100);
    await page.screenshot({ path: path.join(OUT, `390-${id}.png`) });
  }

  // Form submits to WhatsApp fallback
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" }));
  await sleep(900);
  await page.fill("#contact-name", "Test Person");
  await page.fill("#contact-email", "test@example.com");
  await page.selectOption("#contact-project", { index: 1 });
  await page.fill("#contact-details", "Theme check enquiry");
  await page.locator('button[type="submit"]').click();
  await sleep(1500);
  const waLink = await page.locator('a[href*="wa.me"]').filter({ hasText: "Send via WhatsApp" }).count();
  const status = await page.locator(".form__status").innerText();
  check("form: submits and offers WhatsApp fallback", waLink === 1, `status=${status}`);
  await page.screenshot({ path: path.join(OUT, "390-contact.png") });

  check("phone: no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------------- Reduced motion ----------------
{
  const { ctx, page, errors } = await newPage(1440, 900, { reducedMotion: "reduce" });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await sleep(1200);
  const rm = await page.evaluate(() => {
    const words = document.querySelectorAll(".tagline-word");
    let full = 0;
    words.forEach((w) => {
      if (Number(getComputedStyle(w).opacity) > 0.9) full++;
    });
    return {
      gate: document.querySelectorAll("[data-gate]").length,
      taglineFull: full,
      taglineTotal: words.length,
    };
  });
  check("reduced-motion: gate gone, tagline at final state", rm.gate === 0 && rm.taglineFull === rm.taglineTotal && rm.taglineTotal === 5, JSON.stringify(rm));
  check("reduced-motion: no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------------- Legal pages + 404 ----------------
{
  const { ctx, page, errors } = await newPage(1440, 900);
  for (const [slug, h1] of [["privacy", "Privacy"], ["terms", "Terms"]]) {
    await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle" });
    const got = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent ?? "",
      back: !!document.querySelector('a[href="/"]'),
    }));
    check(`/${slug}: loads with h1 + back link`, got.h1 === h1 && got.back, JSON.stringify(got));
  }
  await page.goto(`${BASE}/nope-not-real`, { waitUntil: "networkidle" });
  const nf = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent ?? "",
    home: !!document.querySelector('a[href="/"]'),
    plan: !!document.querySelector('a[href="/#contact"]'),
  }));
  check("404: branded page with home + free-plan links", /does not exist/.test(nf.h1) && nf.home && nf.plan, JSON.stringify(nf));
  // The 404 page itself logs one expected resource error (the 404
  // status); anything else is a real error.
  const realErrors = errors.filter((e) => !/404/.test(e));
  check("legal/404: no console/page errors besides the expected 404", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILED:", failed.map((f) => f.name).join(" | "));
  process.exit(1);
}
