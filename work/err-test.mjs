import { createRequire } from 'module';
const require = createRequire('/home/hatch/workspace/chat-website/package.json');
const { chromium } = require('playwright-core');
const b = await chromium.launch({ executablePath: '/home/hatch/.pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
// Scroll to contact, submit the form empty.
await p.locator('#contact').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
await p.locator('#contact form button[type="submit"]').click();
await p.waitForTimeout(500);
const summary = await p.evaluate(() => {
  const s = document.querySelector('.form__summary');
  if (!s) return { present: false };
  return { present: true, heading: s.querySelector('h3, [role="heading"], p')?.textContent?.trim(), links: [...s.querySelectorAll('a')].map(a => a.getAttribute('href')), focused: document.activeElement === s || s.contains(document.activeElement), activeTag: document.activeElement?.tagName, activeRole: document.activeElement?.getAttribute('role') };
});
console.log('error summary:', JSON.stringify(summary));
// Click the first summary link -> should focus that field.
if (summary.links?.length) {
  await p.locator('.form__summary a').first().click();
  await p.waitForTimeout(300);
  const focused = await p.evaluate(() => ({ id: document.activeElement?.id, tag: document.activeElement?.tagName }));
  console.log('after summary link click, focused:', JSON.stringify(focused));
}
console.log('errors:', errs.length ? errs : 'none');
// WhatsApp float dots: sample the float's pixels (bottom-right, 1440x900).
await p.locator('#top').scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
await p.screenshot({ path: '/tmp/float-check.png' });
await b.close();
