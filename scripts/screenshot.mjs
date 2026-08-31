// Screenshot the running dev server. Requires `npm run dev` to already be up.
//
//   node scripts/screenshot.mjs                                          desktop + mobile of /
//   node scripts/screenshot.mjs --path /work                             a specific route
//   node scripts/screenshot.mjs --w 390 --click "[aria-label='Open menu']"
//   node scripts/screenshot.mjs --scroll 1000                            past the hero
//   node scripts/screenshot.mjs --full                                   whole page, not just viewport
//
// Writes to .screenshots/<name>-<viewport>.png and prints each path.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT_DIR = ".screenshots";

// 390 and 1440 straddle the 641px breakpoint the nav switches on.
const PRESETS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

const argv = process.argv.slice(2);
const opts = { url: "http://localhost:3000", path: "/", height: 900, clicks: [] };

for (let i = 0; i < argv.length; i++) {
  const flag = argv[i];
  const value = () => argv[++i];
  if (flag === "--url") opts.url = value();
  else if (flag === "--path") opts.path = value();
  else if (flag === "--w") opts.width = Number(value());
  else if (flag === "--h") opts.height = Number(value());
  else if (flag === "--scroll") opts.scroll = Number(value());
  else if (flag === "--click") opts.clicks.push(value());
  else if (flag === "--wait") opts.wait = value();
  else if (flag === "--name") opts.name = value();
  else if (flag === "--full") opts.full = true;
  else {
    console.error(`Unknown flag: ${flag}`);
    process.exit(1);
  }
}

const viewports = opts.width
  ? [{ label: `${opts.width}w`, width: opts.width, height: opts.height }]
  : PRESETS;

const name =
  opts.name ?? (opts.path === "/" ? "home" : opts.path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-"));

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });

  try {
    // Not networkidle — Next's dev server holds an HMR websocket open, so it never settles.
    await page.goto(new URL(opts.path, opts.url).href, { waitUntil: "load" });
  } catch (err) {
    await browser.close();
    console.error(
      err.message.includes("ERR_CONNECTION_REFUSED")
        ? `Nothing serving at ${opts.url} — is \`npm run dev\` running?`
        : err.message,
    );
    process.exit(1);
  }

  if (opts.wait) await page.waitForSelector(opts.wait);
  if (opts.scroll) {
    await page.mouse.wheel(0, opts.scroll);
    // Long enough for the Reveal fade-ins (0.64s) plus their stagger to settle.
    await page.waitForTimeout(1100);
  }
  for (const selector of opts.clicks) {
    await page.click(selector);
    await page.waitForTimeout(400); // covers the 300ms overlay/nav transitions
  }

  const file = `${OUT_DIR}/${name}-${viewport.label}.png`;
  await page.screenshot({ path: file, fullPage: Boolean(opts.full) });
  console.log(file);
  await page.close();
}

await browser.close();
