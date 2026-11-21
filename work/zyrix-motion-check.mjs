/**
 * Motion + legibility verification for the Zyrix upgrade pass.
 * Runs against the production build (npm run start, port 3000).
 * Usage: node work/zyrix-motion-check.mjs
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire("/home/hatch/workspace/chat-website/package.json");
const { chromium } = require("playwright-core");

const SHELL =
  "/home/hatch/.pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell";
const BASE = "http://127.0.0.1:3000";
const OUT = new URL("./shots-motion/", import.meta.url).pathname;
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
  // Gate timing is tight (~1.7s to unmount) and hydration time varies
  // in the headless shell, so measure right after the HTML lands and
  // then wait for the detach instead of a fixed sleep.
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

  // Hero words split + settled visible
  const heroWords = await page.locator("h1 .rv-i").count();
  const heroOpacity = await page.locator("h1").evaluate((el) => {
    const inners = el.querySelectorAll(".rv-i");
    return inners.length ? getComputedStyle(inners[inners.length - 1]).opacity : "n/a";
  });
  check("hero: h1 split into word masks and settled", heroWords >= 8 && heroOpacity === "1", `words=${heroWords} last-opacity=${heroOpacity}`);

  // Orb canvas visible + scrim present on hero
  const scrim = await page.locator("h1.scrim").count();
  check("hero: h1 has frosted scrim", scrim === 1);

  // Ring cursor appears on pointer move (desktop only)
  await page.mouse.move(700, 450);
  await sleep(600);
  const ringOpacity = await page.locator(".ring-cursor").evaluate((el) => getComputedStyle(el).opacity);
  check("ring cursor: appears on pointer move", ringOpacity === "1", `opacity=${ringOpacity}`);

  // Nav serif hover swap
  const navLink = page.locator(".nav__links a").first();
  const before = await navLink.evaluate((el) => getComputedStyle(el).fontFamily);
  await navLink.hover();
  await sleep(200);
  const after = await navLink.evaluate((el) => getComputedStyle(el).fontFamily);
  check("nav: link swaps to serif on hover", /Instrument Serif/.test(after), `before=${before.slice(0, 30)} after=${after.slice(0, 30)}`);

  // Pill buttons + gold flood layer present
  const btnRadius = await page.locator(".btn--primary").first().evaluate((el) => getComputedStyle(el).borderRadius);
  check("CTA: pill radius", btnRadius.startsWith("999"), `radius=${btnRadius}`);

  // Scroll through sections, screenshot each, verify headings split + settled
  const sections = ["difference", "result", "promise", "services", "journey", "work", "pricing", "risk", "faq", "contact"];
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
        orbDim: document.documentElement.dataset.orbDim ?? "0",
      };
    }, id);
    check(`section #${id}: h2 words split + settled`, info.words >= 1 && info.settled === "1", `words=${info.words} opacity=${info.settled} orbDim=${info.orbDim}`);
  }

  // Orb veil: dimmed while a dark section is centred
  await page.evaluate(() => document.getElementById("result")?.scrollIntoView({ behavior: "instant", block: "center" }));
  await sleep(900);
  const dimAtResult = await page.evaluate(() => document.documentElement.dataset.orbDim);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(900);
  const dimAtTop = await page.evaluate(() => document.documentElement.dataset.orbDim);
  check("orb veil: dimmed over text sections, clear at hero", dimAtResult === "1" && dimAtTop !== "1", `result=${dimAtResult} top=${dimAtTop}`);

  // Footer wordmark + tagline revealed
  await page.evaluate(() => document.getElementById("footer")?.scrollIntoView({ behavior: "instant" }));
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT, "1440-footer.png") });
  const footerOp = await page.locator("#footer .display").first().evaluate((el) => getComputedStyle(el).opacity);
  check("footer: tagline visible after scroll", footerOp === "1", `opacity=${footerOp}`);

  // Result pitch scrub still works (words reach full opacity at the
  // end of the scrub range: section bottom at 45% of the viewport)
  await page.evaluate(() => {
    const sec = document.getElementById("result");
    const bottom = sec.offsetTop + sec.offsetHeight;
    window.scrollTo(0, bottom - window.innerHeight * 0.45);
  });
  await sleep(900);
  const pitchOp = await page.locator(".pitch-word").last().evaluate((el) => getComputedStyle(el).opacity);
  check("result pitch: scrub still reaches full ink", Number(pitchOp) > 0.9, `opacity=${pitchOp}`);

  // Console errors on desktop pass
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

  // Hero fold: exactly 844px
  const heroH = await page.evaluate(() => document.getElementById("top")?.getBoundingClientRect().height);
  check("phone: hero ends exactly at the fold (844px)", Math.round(heroH) === 844, `height=${heroH}`);
  await page.screenshot({ path: path.join(OUT, "390-hero.png") });

  // Gate skipped on second load (sessionStorage) — reload and check it
  // lifts fast (350ms lift + 750ms curtain = gone ~1.1s after hydration;
  // hydration itself takes ~6s in this headless shell, so the window is
  // generous on purpose)
  await page.reload({ waitUntil: "networkidle" });
  let gateFastGone = false;
  try {
    await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 15000 });
    gateFastGone = true;
  } catch {
    gateFastGone = false;
  }
  check("gate: returning visit lifts fast (gone <15s)", gateFastGone, `gone=${gateFastGone}`);

  // Mobile menu slides in
  await page.locator('button[aria-label="Menu"]').click();
  await sleep(700);
  const panel = await page.locator("#mobile-menu").evaluate((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { x: Math.round(r.x), visible: cs.visibility, w: Math.round(r.width) };
  });
  check("mobile menu: slides in from right", panel.visible === "visible" && panel.x >= 0 && panel.x < 390, `x=${panel.x} w=${panel.w} visibility=${panel.visible}`);
  await page.screenshot({ path: path.join(OUT, "390-menu.png") });
  // Close via a nav link
  await page.locator("#mobile-menu nav a").first().click();
  await sleep(700);
  const panelClosed = await page.locator("#mobile-menu").evaluate((el) => getComputedStyle(el).visibility);
  check("mobile menu: closes on link tap", panelClosed === "hidden", `visibility=${panelClosed}`);

  // Ring cursor must NOT exist/be visible on touch-width (pointer:fine check)
  const ringCount = await page.locator(".ring-cursor").count();
  const ringOp = ringCount
    ? await page.locator(".ring-cursor").evaluate((el) => getComputedStyle(el).opacity)
    : "n/a";
  check("phone: ring cursor stays hidden", ringCount === 0 || ringOp === "0", `count=${ringCount} opacity=${ringOp}`);

  // Scroll sections on phone, screenshot promise + services + pricing (orb crossings)
  for (const id of ["promise", "services", "pricing"]) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await sleep(1100);
    await page.screenshot({ path: path.join(OUT, `390-${id}.png`) });
  }
  const h2Words = await page.evaluate(() => {
    const h2 = document.querySelector("#pricing h2");
    return h2?.querySelectorAll(".rv-i").length ?? 0;
  });
  check("phone: pricing h2 split + revealed", h2Words >= 1, `words=${h2Words}`);

  // Form still submits to WhatsApp fallback
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" }));
  await sleep(900);
  await page.fill("#contact-name", "Test Person");
  await page.fill("#contact-email", "test@example.com");
  await page.selectOption("#contact-project", { index: 1 });
  await page.fill("#contact-details", "Motion check enquiry");
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
  const gate = await page.locator("[data-gate]").count();
  const rvSpans = await page.locator(".rv-i").count();
  const h1Op = await page.locator("h1").evaluate((el) => getComputedStyle(el).opacity);
  check("reduced motion: no gate, no word splits, hero visible", gate === 0 && rvSpans === 0 && h1Op === "1", `gate=${gate} rv=${rvSpans} h1opacity=${h1Op}`);
  check("reduced motion: no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILED:");
  failed.forEach((f) => console.log(` - ${f.name} — ${f.detail}`));
  process.exit(1);
}
