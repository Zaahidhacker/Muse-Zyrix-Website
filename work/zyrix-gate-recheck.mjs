/** Focused re-check: returning-visit gate on a phone context. */
import { createRequire } from "module";

const require = createRequire("/home/hatch/workspace/chat-website/package.json");
const { chromium } = require("playwright-core");

const SHELL =
  "/home/hatch/.pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell";
const BASE = "http://127.0.0.1:3000";

const browser = await chromium.launch({ executablePath: SHELL, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();

const t0 = Date.now();
await page.goto(BASE, { waitUntil: "networkidle" });
try {
  await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 15000 });
  console.log(`first load: gate gone after ${Date.now() - t0}ms`);
} catch {
  console.log("first load: gate STILL present after 15s — BUG");
}
const flag = await page.evaluate(() => window.sessionStorage.getItem("zyrix-gate-seen"));
console.log("sessionStorage zyrix-gate-seen =", flag);

const t1 = Date.now();
await page.reload({ waitUntil: "networkidle" });
const gateCount = await page.locator("[data-gate]").count();
console.log(`after reload: gate present=${gateCount} (networkidle at ${Date.now() - t1}ms)`);
try {
  await page.locator("[data-gate]").waitFor({ state: "detached", timeout: 15000 });
  console.log(`returning visit: gate gone after ${Date.now() - t1}ms from reload start`);
} catch {
  console.log("returning visit: gate STILL present after 15s — BUG");
}
await browser.close();
