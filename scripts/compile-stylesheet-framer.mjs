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
//   framer/happen.css          the raw sheet, for hosting
//   framer/GlobalStylesheet.tsx  the sheet as a template string plus injectHappenCSS()
//   framer/head.html           the sheet as a <style> block for Framer's Custom Code
//
// Both Framer outputs are needed, because they cover different moments. The
// .tsx is pasted as a code file and imported by every section: custom code does
// not run on the Framer canvas, so without it components are unstyled while you
// design. head.html covers the published site, where Framer server-renders the
// markup and the JS bundle arrives seconds later — long enough to paint raw
// unstyled HTML first. In the page's head the sheet blocks that first paint the
// way any stylesheet does, and injectHappenCSS() then stands down.

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
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
const OUT_HEAD = path.join(OUT_DIR, "head.html");

// The oldest browsers this sheet can work in at all: app/page.module.css uses
// @container, which is Safari 16 and Chrome 105. Naming them buys two things at
// once — the minifier knows what it is allowed to shorten, and it flattens the
// native nesting the .module.css files are written in, which Safari only
// understands from 16.5. The unminified sheet keeps the nesting, so the Framer
// canvas needs a current browser; the published site does not.
const TARGETS = { chrome: 105 << 16, safari: 16 << 16, firefox: 110 << 16, edge: 105 << 16 };

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
// ones (the Inter webfont) have to survive, and CSS requires every @import to
// precede the rest of the sheet, so they are collected and re-emitted at the top.
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
      `   Source of truth is the .module.css files in the Next prototype.\n` +
      `   Regenerate with: pnpm compile-stylesheet-framer */\n`,
  ];

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
  await writeFile(OUT_CSS, sheet);
  const js = jsModule(sheet);
  await writeFile(OUT_JS, js);
  const head = headHtml(sheet);
  await writeFile(OUT_HEAD, head);

  const unused = [...owners.keys()].filter((n) => !used.has(n));
  console.log(`✓ ${rel(OUT_CSS)}  ${moduleFiles.length + GLOBAL_FILES.length} files, ` +
    `${owners.size} class names, ${(sheet.length / 1024).toFixed(1)} kB`);
  console.log(`✓ ${rel(OUT_JS)}  ${(js.length / 1024).toFixed(1)} kB`);
  console.log(`✓ ${rel(OUT_HEAD)}  ${(head.length / 1024).toFixed(1)} kB minified, ` +
    `down from ${(sheet.length / 1024).toFixed(1)} kB`);
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

// The same sheet as a block to paste into Framer's page Custom Code → Start of
// <head>. Two differences from the .tsx: the webfont @import becomes a real
// <link> (an @import is only discovered once the sheet it sits in has been
// fetched and parsed, which puts the font a whole round trip behind), and the
// <style> carries data-happen-static, which is what tells injectHappenCSS() the
// page already has the sheet.
function headHtml(sheet) {
  const urls = [...remoteImports]
    .map((stmt) => stmt.match(/url\(\s*["']?([^"')]+)["']?\s*\)/)?.[1] ??
      stmt.match(/["']([^"']+)["']/)?.[1])
    .filter(Boolean);

  const origins = new Set(urls.map((u) => new URL(u).origin));
  // Google answers the CSS from one host and serves the font files from
  // another, and the browser only learns about the second once the first has
  // parsed. Warm both while the HTML is still arriving.
  if (origins.has("https://fonts.googleapis.com")) origins.add("https://fonts.gstatic.com");

  const links = [
    ...[...origins].map(
      (o) => `<link rel="preconnect" href="${o}"${o.includes("gstatic") ? " crossorigin" : ""}>`,
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

     Paste into Framer under the page's settings → Custom Code → Start of
     <head>. Per page, not site-wide: the reset in app/globals.css is unscoped
     and would restyle every other page on the site.

     Without this the published page paints Framer's server-rendered markup
     with no CSS at all until the JS bundle runs injectHappenCSS(), which on a
     throttled connection is a couple of seconds of raw unstyled HTML.

     Re-paste whenever the stylesheet is regenerated, alongside
     ${FRAMER_FILE}.tsx. Minified, and the nesting is flattened for Safari 16 —
     read framer/happen.css instead. -->
${links.join("\n")}
<style data-happen="happen" data-happen-static>
${body.trim()}
</style>
`;
}

function jsModule(sheet) {
  // Minified for the same reason head.html is, and it matters more here: a JS
  // minifier cannot touch the inside of a string literal, so whatever is in
  // this template is exactly what Framer serves. Unminified it is 72 kB of
  // CSS comments riding in the page bundle, and on the published site the
  // injector returns before it ever reads them.
  // Backticks and ${ have to survive the trip through a template literal.
  const escaped = minify(sheet).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return `// @ts-nocheck
// Generated by scripts/compile-stylesheet-framer.mjs — do not edit.
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
  // On the published site the sheet is already in the head, from head.html,
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
