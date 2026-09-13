#!/usr/bin/env node
// Flattens every stylesheet in the prototype into one global sheet for Framer.
//
// Framer has no CSS-module support, so the scoping that keeps `.section` in
// Section.module.css from colliding with `.section` anywhere else disappears.
// This script refuses to write unless every class name is already unique across
// every file — the invariant the class names were renamed to satisfy.
//
//   pnpm compile-stylesheet-framer
//
// Writes three files:
//
//   framer/happen.css                 the raw sheet, for hosting
//   framer/GlobalStylesheet.tsx       the sheet as a template string plus injectHappenCSS()
//   framer/GlobalStylesheetHead.html  the sheet as a <style> block for Framer's Custom Code
//
// Both Framer outputs are needed, because they cover different moments. The
// .tsx is pasted as a code file and imported by every section: custom code does
// not run on the Framer canvas, so without it components are unstyled while you
// design. GlobalStylesheetHead.html covers the published site, where Framer server-renders the
// markup and the JS bundle arrives seconds later — long enough to paint raw
// unstyled HTML first. In the page's head the sheet blocks that first paint the
// way any stylesheet does, and injectHappenCSS() then stands down.

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { transform } from "lightningcss";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "framer");
// Framer's code editor creates files as .tsx, so the generated module is named
// to match the file it gets pasted into. Plain JS is valid TypeScript, so
// nothing in it needs annotating.
const FRAMER_FILE = "GlobalStylesheet";
const OUT_CSS = path.join(OUT_DIR, "happen.css");
const OUT_JS = path.join(OUT_DIR, `${FRAMER_FILE}.tsx`);
// Named after the Custom Code entry it is pasted into, GlobalStylesheetHead —
// the same sheet as the .tsx, for the page's <head>.
const HEAD_FILE = `${FRAMER_FILE}Head`;
const OUT_HEAD = path.join(OUT_DIR, `${HEAD_FILE}.html`);

// The oldest browsers this sheet can work in at all: app/page.module.css uses
// @container, which is Safari 16 and Chrome 105. Naming them buys two things at
// once — the minifier knows what it is allowed to shorten, and it flattens the
// native nesting the .module.css files are written in, which Safari only
// understands from 16.5. The unminified sheet keeps the nesting, so the Framer
// canvas needs a current browser; the published site does not.
const TARGETS = { chrome: 105 << 16, safari: 16 << 16, firefox: 110 << 16, edge: 105 << 16 };

// Every generated file carries a "Generated <date> · <build>" stamp, so the copy
// pasted into Framer can be matched against the repo without diffing 42 kB by
// eye. The build id is one hash of the compiled sheet, shared by all three
// outputs, so two files carrying the same id were built from the same CSS.
//
// The date is only bumped when a file's content actually changes, which is what
// makes it worth reading: regenerating an unchanged sheet keeps the old date and
// leaves git clean, so the date says "when this last changed", not "when I last
// ran the script". Content is compared with the stamp punched back out, since
// the stamp is the one part guaranteed to differ.
const PLACEHOLDER = "__HAPPEN_STAMP__";
const STAMP_RE = /Generated (\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC) \u00b7 ([0-9a-f]{8})/;

async function writeStamped(file, build, make) {
  const draft = make(PLACEHOLDER);

  let date = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
  let changed = true;
  try {
    const prev = await readFile(file, "utf8");
    const m = prev.match(STAMP_RE);
    // Split on the bare "<date> · <build>" value, not on the whole match:
    // the .html carries the stamp twice, and the second one is an attribute
    // value with no "Generated" in front of it.
    if (m && prev.split(`${m[1]} \u00b7 ${m[2]}`).join(PLACEHOLDER) === draft) {
      date = m[1];
      changed = false;
    }
  } catch {
    // No previous file. Freshly generated, so the current date is correct.
  }

  const out = draft.split(PLACEHOLDER).join(`${date} \u00b7 ${build}`);
  await writeFile(file, out);
  return { changed, kB: (out.length / 1024).toFixed(1) };
}

const minify = (css) =>
  transform({ filename: "happen.css", code: Buffer.from(css), minify: true, targets: TARGETS })
    .code.toString();

// Order matters: tokens define the custom properties everything else reads.
const GLOBAL_FILES = [
  "app/styles/tokens.css",
  "app/styles/utilities.css",
  "app/globals.css",
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith(".module.css")) out.push(full);
  }
  return out;
}

// Comments and url() payloads are full of dotted words (file names, hostnames,
// inline SVG) that are not selectors, so drop them before scanning.
const scannable = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/url\([^)]*\)/g, "url()");

const classNames = (css) =>
  new Set(
    [...scannable(css).matchAll(/(?<![\d])\.([_a-zA-Z][\w-]*)/g)].map(
      (m) => m[1],
    ),
  );

// `:global(.x)` is a CSS-module construct. Once the sheet is global the wrapper
// is meaningless and invalid, so unwrap it.
const unwrapGlobal = (css) =>
  css.replace(/:global\s*\(([^)]*)\)/g, "$1");

// Local @imports are satisfied by the concatenation itself, so they go. Remote
// ones have to survive, and CSS requires every @import to precede the rest of
// the sheet, so they are collected and re-emitted at the top.
//
// Inter is not one of these. It used to be — a Google @import seeded here —
// but on the published Framer page that stylesheet was render-blocking, ~360ms
// on a second origin before the first paint. It now comes from app/fonts.css,
// the same self-hosted file the Next site uses, pointed at the asset host (see
// main()).
const remoteImports = new Set();

const takeImports = (css) =>
  css.replace(/^\s*@import[^;\n]+;\s*$/gm, (stmt) => {
    if (/["'(]\s*(https?:)?\/\//.test(stmt)) remoteImports.add(stmt.trim());
    return "";
  });

const rel = (f) => path.relative(ROOT, f);

const banner = (f) =>
  `\n/* ${"=".repeat(68)}\n   ${rel(f)}\n   ${"=".repeat(68)} */\n`;

async function main() {
  const moduleFiles = [
    path.join(ROOT, "app/page.module.css"),
    ...(await walk(path.join(ROOT, "components"))),
  ].sort();

  // --- guard: no class name may appear in two module files -----------------
  const owners = new Map();
  const collisions = new Map();
  for (const file of moduleFiles) {
    for (const name of classNames(await readFile(file, "utf8"))) {
      if (owners.has(name) && owners.get(name) !== file) {
        collisions.set(name, [...(collisions.get(name) ?? [owners.get(name)]), file]);
      } else owners.set(name, file);
    }
  }
  if (collisions.size) {
    console.error(
      `\nRefusing to write: ${collisions.size} class name(s) appear in more than one stylesheet.\n` +
        `They would overwrite each other once the sheet is global.\n`,
    );
    for (const [name, files] of collisions)
      console.error(`  .${name}\n${files.map((f) => `      ${rel(f)}`).join("\n")}`);
    process.exit(1);
  }

  // --- guard: every styles.X used in JSX must exist in the sheet -----------
  const jsxFiles = (await walk2(path.join(ROOT, "components"))).concat(
    path.join(ROOT, "app/page.js"),
  );
  const used = new Set();
  for (const file of jsxFiles)
    for (const m of (await readFile(file, "utf8")).matchAll(/\bstyles\.([\w$]+)/g))
      used.add(m[1]);
  const missing = [...used].filter((n) => !owners.has(n));
  if (missing.length) {
    console.error(
      `\nRefusing to write: JSX references class names no stylesheet defines:\n` +
        missing.map((n) => `  styles.${n}`).join("\n"),
    );
    process.exit(1);
  }

  // --- build ---------------------------------------------------------------
  const parts = [
    `/* Generated by scripts/compile-stylesheet-framer.mjs — do not edit.\n` +
      `   Generated ${PLACEHOLDER}\n` +
      `   Source of truth is the .module.css files in the Next prototype.\n` +
      `   Regenerate with: pnpm compile-stylesheet-framer */\n`,
  ];

  // Inter, from the file the Next site self-hosts it with. Its url() is
  // root-relative, which on Framer would resolve against Framer's own domain,
  // so it is pointed at the asset host every other image already comes from.
  // That host sends Access-Control-Allow-Origin: *, which a cross-origin font
  // needs to load at all.
  const assetBase = (await readFile(path.join(ROOT, "framer/Primitives.tsx"), "utf8"))
    .match(/export const ASSET_BASE = "([^"]+)"/)?.[1];
  if (!assetBase) {
    console.error(`\nRefusing to write: no ASSET_BASE found in framer/Primitives.tsx.`);
    process.exit(1);
  }
  const fontsFile = path.join(ROOT, "app/fonts.css");
  const fontsCss = (await readFile(fontsFile, "utf8"))
    .replace(/url\("(\/[^"]+)"\)/g, `url("${assetBase}$1")`);
  const fontUrls = [...fontsCss.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((m) => m[1]);
  parts.push(banner(fontsFile), fontsCss.trim(), "\n");

  for (const f of GLOBAL_FILES) {
    const full = path.join(ROOT, f);
    parts.push(banner(full));
    if (f === "app/globals.css")
      parts.push(
        `/* REVIEW BEFORE SHIPPING: the reset below is unscoped and will also\n` +
          `   hit Framer's own DOM on the page. Trim it if Framer's layout shifts. */\n`,
      );
    parts.push(unwrapGlobal(takeImports(await readFile(full, "utf8"))).trim(), "\n");
  }

  for (const full of moduleFiles) {
    parts.push(banner(full));
    parts.push(unwrapGlobal(takeImports(await readFile(full, "utf8"))).trim(), "\n");
  }

  // Must lead the file: a comment may precede an @import, a rule may not.
  if (remoteImports.size) parts.splice(1, 0, [...remoteImports].join("\n"), "");

  const sheet = parts.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";

  await mkdir(OUT_DIR, { recursive: true });
  // The sheet is stamped first, then embedded in the other two, so all three
  // files carry the same hash only when they were built from the same CSS.
  const build = createHash("sha256").update(sheet).digest("hex").slice(0, 8);
  const css = await writeStamped(OUT_CSS, build, (s) => sheet.split(PLACEHOLDER).join(s));
  const js = await writeStamped(OUT_JS, build, (s) => jsModule(sheet, s));
  const head = await writeStamped(OUT_HEAD, build, (s) => headHtml(sheet, s, { assetBase, fontUrls }));

  const unused = [...owners.keys()].filter((n) => !used.has(n));
  // "changed" is the line to read: those are the files that have to be pasted
  // into Framer again. An unchanged file keeps its old stamp, so a run that
  // reports nothing changed leaves the working tree clean.
  const mark = (r) => (r.changed ? "updated" : "unchanged");
  console.log(`\nbuild ${build}`);
  console.log(`✓ ${rel(OUT_CSS)}  ${moduleFiles.length + GLOBAL_FILES.length} files, ` +
    `${owners.size} class names, ${css.kB} kB — ${mark(css)}`);
  console.log(`✓ ${rel(OUT_JS)}  ${js.kB} kB — ${mark(js)}`);
  console.log(`✓ ${rel(OUT_HEAD)}  ${head.kB} kB minified, ` +
    `down from ${(sheet.length / 1024).toFixed(1)} kB — ${mark(head)}`);

  const stale = [[OUT_CSS, css], [OUT_JS, js], [OUT_HEAD, head]].filter(([, r]) => r.changed);
  if (stale.length)
    console.log(`\nre-paste into Framer: ` +
      stale.map(([f]) => path.basename(f)).filter((n) => n !== "happen.css").join(", "));
  if (unused.length)
    console.log(`\nnote: ${unused.length} class name(s) defined but never used via styles.X ` +
      `(fine if applied as a descendant selector):\n  ${unused.join(", ")}`);
}

// jsx/js walker, kept separate so the css walker stays single-purpose
async function walk2(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk2(full)));
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// The ribbons are the published page's largest paint, and the sheet only names
// them through custom properties Ribbons.tsx sets once it mounts — so without a
// preload the browser finds them late and fetches them at low priority. The
// component can't preload them itself: nothing ReactDOM.preload() emits reaches
// Framer's server-rendered head. Media queries mirror .ribbonsLayer's
// breakpoint, so only the pair the page will draw is fetched.
const RIBBON_PRELOADS = [
  ["/assets/ribbon-1-mobile.webp", "(max-width: 767.98px)"],
  ["/assets/ribbon-2-mobile.webp", "(max-width: 767.98px)"],
  ["/assets/ribbon-1.webp", "(min-width: 768px)"],
  ["/assets/ribbon-2.webp", "(min-width: 768px)"],
];

// The same sheet as a block to paste into Framer's Custom Code → Start of
// <head>. Differences from the .tsx: any remote @import becomes a real <link>
// (an @import is only discovered once the sheet it sits in has been fetched and
// parsed); the font and the ribbons are preloaded, since the sheet only reveals
// them once it has been applied; and the <style> carries data-happen-static,
// which is what tells injectHappenCSS() the page already has the sheet.
function headHtml(sheet, stamp, { assetBase, fontUrls }) {
  const urls = [...remoteImports]
    .map((stmt) => stmt.match(/url\(\s*["']?([^"')]+)["']?\s*\)/)?.[1] ??
      stmt.match(/["']([^"']+)["']/)?.[1])
    .filter(Boolean);

  const links = [
    // `crossorigin` because fonts are always fetched in CORS mode; without it
    // the preloaded copy doesn't match the @font-face request and is fetched twice.
    ...fontUrls.map(
      (u) => `<link rel="preload" href="${u}" as="font" type="font/woff2" crossorigin>`,
    ),
    ...RIBBON_PRELOADS.map(
      ([p, media]) =>
        `<link rel="preload" href="${assetBase}${p}" as="image" fetchpriority="high" media="${media}">`,
    ),
    ...urls.map((u) => `<link rel="stylesheet" href="${u}">`),
  ];

  // The @imports are re-emitted above as links, so they must not also appear
  // inside the style block: an @import after a rule is dropped anyway.
  // Minified, because unlike the other two outputs nobody reads this one: it is
  // pasted once and then lives in the page's HTML, where it is roughly 40 kB
  // instead of 72 and blocks the first paint for correspondingly less time.
  const body = minify(sheet.replace(/^\s*@import[^;\n]+;\s*$/gm, ""));

  return `<!-- Generated by scripts/compile-stylesheet-framer.mjs — do not edit.
     Generated ${stamp}

     Paste into Framer under Site Settings → Code, as the entry named
     ${HEAD_FILE}, placed at Start of <head>. Limit its Page field to the
     Happen pages rather than leaving it site-wide: the reset in
     app/globals.css is unscoped and would restyle every other page.

     Without this the published page paints Framer's server-rendered markup
     with no CSS at all until the JS bundle runs injectHappenCSS(), which on a
     throttled connection is a couple of seconds of raw unstyled HTML.

     Re-paste whenever the stylesheet is regenerated, alongside
     ${FRAMER_FILE}.tsx. Minified, and the nesting is flattened for Safari 16 —
     read framer/happen.css instead. -->
${links.join("\n")}
<style data-happen="happen" data-happen-static="${stamp}">
${body.trim()}
</style>
`;
}

function jsModule(sheet, stamp) {
  // Minified for the same reason the .html is, and it matters more here: a JS
  // minifier cannot touch the inside of a string literal, so whatever is in
  // this template is exactly what Framer serves. Unminified it is 72 kB of
  // CSS comments riding in the page bundle, and on the published site the
  // injector returns before it ever reads them.
  // Backticks and ${ have to survive the trip through a template literal.
  const escaped = minify(sheet).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return `// @ts-nocheck
// Generated by scripts/compile-stylesheet-framer.mjs — do not edit.
// Generated ${stamp}
// Paste into Framer as a code file named ${FRAMER_FILE}.tsx.
//
// Every Framer code component imports this once:
//
//   import { injectHappenCSS } from "./${FRAMER_FILE}.tsx"
//   injectHappenCSS()
//
// Keyed by a data attribute so Framer's editor hot reload replaces the sheet
// rather than stacking a new copy on every edit.
//
// The sheet below is minified. framer/happen.css is the same CSS with its
// comments and source banners intact — read that one.

export const happenCSS = \`${escaped}\`

export function injectHappenCSS(id = "happen", text = happenCSS) {
  if (typeof document === "undefined") return
  // On the published site the sheet is already in the head, from ${HEAD_FILE}.html,
  // where it was parsed before the first paint. Rewriting it from here would at
  // best change nothing. The canvas has no custom code, so this only ever
  // short-circuits on the live site.
  if (document.querySelector("style[data-happen-static]")) return
  let el = document.querySelector('style[data-happen="' + id + '"]')
  if (!el) {
    el = document.createElement("style")
    el.setAttribute("data-happen", id)
    document.head.appendChild(el)
  }
  if (el.textContent !== text) el.textContent = text
}
`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
