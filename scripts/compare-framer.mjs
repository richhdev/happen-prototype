#!/usr/bin/env node
// Diffs every section on / against its ported copy on /framer/.
//
//   pnpm dev            (in another terminal)
//   pnpm compare-framer
//
// A port is a mechanical translation, so the two pages should emit the same
// markup. The only systematic difference is the class names — Next hashes them
// per CSS module, Framer reads them off the global sheet — so those are
// unhashed before comparing and everything else is compared as-is.
//
// Sections that are meant to differ are listed in EXPECTED below, with the
// reason. Anything else reporting a difference is drift.

import { argv } from "node:process";
import { readFile } from "node:fs/promises";

const BASE = argv[2] ?? "http://localhost:3000";

// Framer has no public/, so asset() there prefixes the absolute host that
// Primitives.tsx names. Dropping it is what makes the two src attributes
// comparable; it is read from the file so the two cannot fall out of step.
const ASSET_BASE = (await readFile("framer/Primitives.tsx", "utf8")).match(
  /export const ASSET_BASE = "([^"]+)"/,
)?.[1];
if (!ASSET_BASE) throw new Error("no ASSET_BASE in framer/Primitives.tsx");

// Ported copies that are deliberately not a translation of the source.
const EXPECTED = {
  ribbonsLayer:
    "portals into #main after mount, so it is absent from the server HTML on /framer/",
};

// Both module naming schemes reduce to the bare class name, so the comparison
// runs on identical strings rather than merely similar shapes. Turbopack serves
// dev as `Section-module__uOwoca__section`, webpack builds as
// `About_aboutTitle__Chs27` — name last in one, in the middle in the other.
const unhash = (html) =>
  html
    .replace(
      /\b[A-Za-z][A-Za-z0-9]*-module__[^\s"]*__([A-Za-z][A-Za-z0-9-]*)(?=[\s"]|$)/g,
      "$1",
    )
    .replace(/\b[A-Za-z][A-Za-z0-9]*_([A-Za-z][A-Za-z0-9-]*)__[A-Za-z0-9_-]+\b/g, "$1")
    .replace(/class="([^"]*)"/g, (_, v) => `class="${v.trim().replace(/\s+/g, " ")}"`)
    .split(ASSET_BASE)
    .join("");

// Every top-level child of <main>, in order. Both pages stack the same
// components in the same order, so comparing by position covers the ones with
// no id of their own — Ribbons, Work and Artists — as well as the nav targets.
// Hero renders as <header> and Contact as <footer>, which is why nothing here
// keys off the tag name.
const VOID = new Set(
  "area base br col embed hr img input link meta param source track wbr".split(" "),
);

function mainChildren(html) {
  const open = html.match(/<main\b[^>]*>/);
  if (!open) throw new Error("no <main> on the page");
  const body = html.slice(open.index + open[0].length);
  const tag = /<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g;
  const out = [];
  let depth = 0;
  let start = 0;
  let m;
  while ((m = tag.exec(body))) {
    const [raw, slash, name, attrs] = m;
    if (VOID.has(name.toLowerCase()) || attrs.endsWith("/")) {
      if (depth === 0) out.push({ label: label(name, attrs), html: raw });
      continue;
    }
    if (!slash) {
      if (depth === 0) start = m.index;
      depth++;
    } else {
      depth--;
      if (depth === 0)
        out.push({
          label: labelOf(body.slice(start, tag.lastIndex)),
          html: body.slice(start, tag.lastIndex),
        });
      if (depth < 0) break; // the </main> that closes the container
    }
  }
  return out;
}

const label = (name, attrs) =>
  (attrs.match(/\bid="([^"]+)"/) ?? attrs.match(/\bclass="([^"\s]+)/) ?? [, name])[1];

const labelOf = (frag) => {
  const m = frag.match(/<([a-zA-Z][\w-]*)([^>]*)>/);
  return m ? label(m[1], m[2]) : "?";
};

const lines = (s) => s.replace(/></g, ">\n<").split("\n");

function firstDiff(a, b) {
  const A = lines(a), B = lines(b);
  for (let i = 0; i < Math.max(A.length, B.length); i++)
    if (A[i] !== B[i]) return { i, a: A[i] ?? "(end)", b: B[i] ?? "(end)" };
  return null;
}

const get = async (path) => {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(`${path} → ${r.status}. Is \`pnpm dev\` running?`);
  return unhash(await r.text());
};

const [next, framer] = await Promise.all([get("/"), get("/framer/")]);
const a = new Map(mainChildren(next).map((c) => [c.label, c.html]));
const b = new Map(mainChildren(framer).map((c) => [c.label, c.html]));

let drift = 0;
const keys = [...new Set([...a.keys(), ...b.keys()])];
const width = Math.max(...keys.map((k) => k.length));
for (const id of keys) {
  const pad = id.padEnd(width);
  const why = EXPECTED[id];
  if (a.get(id) === b.get(id)) { console.log(`  ok ${pad}`); continue; }
  if (why) { console.log(`  —  ${pad}  ${why}`); continue; }
  if (!b.has(id)) { drift++; console.log(`  !! ${pad}  missing from /framer/`); continue; }
  if (!a.has(id)) { drift++; console.log(`  !! ${pad}  on /framer/ but not on /`); continue; }
  const d = firstDiff(a.get(id), b.get(id));
  drift++;
  console.log(`  !! ${pad}  differs at line ${d.i + 1}`);
  console.log(`        /        ${d.a.slice(0, 118)}`);
  console.log(`        /framer/ ${d.b.slice(0, 118)}`);
}

console.log(
  drift
    ? `\n${drift} block(s) drifted from the source.`
    : `\nEvery ported block matches its source.`,
);
process.exit(drift ? 1 : 0);
