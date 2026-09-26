#!/usr/bin/env node
// Generates the Framer copy of a section from its source in components/.
//
//   pnpm build-framer            write every section
//   pnpm build-framer --check    fail if any committed file is out of date
//   pnpm build-framer About      one section
//
// A port is a mechanical translation, so it is generated rather than written.
// The source is the only copy anyone edits; run this and re-paste the result.
//
// What the transform does, and nothing more:
//
//   · concatenates the section's folder into one file, because Framer lists
//     every export in the Insert panel and a section's private parts should not
//     be there. Data files land above the section, sub-components below, so a
//     module-level constant is always declared before it is read.
//   · rewrites the import block. Everything the barrel re-exports arrives from
//     ./Primitives.tsx instead, `styles` included — it is the identity Proxy
//     that lets the markup keep the source's styles.X untouched.
//   · drops `export` from the folded files, and `"use client"`, which Framer
//     has no concept of.
//   · appends framer/extra/<Name>.tsx if it exists. That is where anything
//     Framer-only goes — property controls, mostly. Nothing else may differ
//     from the source, and `--check` is what keeps that true.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { argv, exit } from "node:process";

// Sections whose Framer copy is a pure translation of the source. The rest are
// hand-written because they carry behaviour that exists only inside Framer and
// cannot sit inertly in the Next app:
//
//   Nav, Ribbons       portal out of Framer's container, which moves the DOM
//   VideoBackground    injects CSS that overrides Framer's page background
//   Hosts, Vendors     flatten their cards into fixed slots for the on-page
//                      editor, which lists no Array control
//   VendorsClosed,     no source in components/ at all; Framer-native
//   EventCard,
//   InstagramCard
//
// `pnpm compare-framer` watches those the same as these.
const SECTIONS = [
  "About", "Artists", "Contact", "Events", "Hero", "Hosts", "Instagram",
  "Services", "Testimonials", "Vendors", "Work",
];

// Specifiers that resolve inside Framer, left exactly as the source writes them.
const PASSTHROUGH = ["react", "react-dom", "framer", "framer-motion"];

const check = argv.includes("--check");
const only = argv.slice(2).filter((a) => !a.startsWith("--"));

// import { a, b } from "x";  |  import x from "y";  |  import "z";
const IMPORT =
  /^import\s+(?:(\{[^}]*\})|([\w$]+)|(?:([\w$]+)\s*,\s*(\{[^}]*\})))?\s*(?:from\s*)?"([^"]+)";?\n/gm;

const names = (braces) =>
  braces.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);

function parse(src, folder) {
  const imports = [];
  const body = src
    .replace(/^"use client";\n+/, "")
    .replace(IMPORT, (raw, braced, def, defWith, bracedWith, spec) => {
      imports.push({ braced: braced ?? bracedWith, def: def ?? defWith, spec });
      return "";
    });
  return { imports, body: body.trim() };
}

// Everything the section owns collapses into the file, so those imports vanish.
const isLocal = (spec, folder) =>
  spec.startsWith("./") ||
  spec.startsWith(`@/components/${folder}/`) ||
  spec.endsWith(".module.css");

function importBlock(all, folder) {
  const merged = new Map(); // spec -> { named:Set, def:string }
  const add = (spec, named = [], def = null) => {
    const e = merged.get(spec) ?? { named: new Set(), def: null };
    named.forEach((n) => e.named.add(n));
    if (def) e.def = def;
    merged.set(spec, e);
  };

  // styles first: it stands in for the per-file CSS-module import.
  add("./Primitives.tsx", ["styles"]);

  for (const { braced, def, spec } of all) {
    if (spec === "@/components/Primitives") add("./Primitives.tsx", names(braced));
    else if (spec === "@/components/VideoBackground/VideoBackground")
      // No default export on the Framer side: Hero and Artists drop it into
      // their own scene rather than it standing alone in the page stack.
      add("./VideoBackground.tsx", ["VideoBackground"]);
    else if (isLocal(spec, folder)) continue;
    else if (PASSTHROUGH.includes(spec)) add(spec, braced ? names(braced) : [], def);
    else throw new Error(`unmapped import: ${spec} (in components/${folder}/)`);
  }

  const order = ["framer", "react", "react-dom", "framer-motion", "./VideoBackground.tsx", "./Primitives.tsx"];
  const out = [];
  for (const spec of order) {
    const e = merged.get(spec);
    if (!e) continue;
    const list = [...e.named];
    const braced = list.length
      ? list.join(", ").length + spec.length + 20 <= 80
        ? `{ ${list.join(", ")} }`
        : `{\n${list.map((n) => `  ${n},`).join("\n")}\n}`
      : "";
    const clause = [e.def, braced].filter(Boolean).join(", ");
    out.push(`import ${clause} from "${spec}";`);
  }
  return out.join("\n");
}

const divider = (file) =>
  `/* ---------------------------------------------------------------------------\n` +
  `   ${file}\n` +
  `   --------------------------------------------------------------------------- */`;

// `export` only survives on the section itself. A named export beside it — Nav's
// NavPlaceholder, Vendors' VendorsClosed — is a second thing the page stack
// places, so it keeps its export too.
const unexport = (body) =>
  body
    .replace(/^export default (function|const|class)\b/gm, "$1")
    .replace(/^export (function|const|class)\b/gm, "$1")
    .replace(/^export default [\w$]+;\n?/gm, "");

async function build(name) {
  const dir = `components/${name}`;
  const files = (await readdir(dir)).filter(
    (f) => /\.(jsx?|js)$/.test(f) && !f.includes(".stories."),
  );
  const entry = `${name}.jsx`;
  if (!files.includes(entry)) throw new Error(`no ${dir}/${entry}`);

  // Data and hooks above the section, sub-components below it.
  const data = files.filter((f) => f.endsWith(".js")).sort();
  const subs = files.filter((f) => f !== entry && f.endsWith(".jsx")).sort();

  const parsed = new Map();
  for (const f of [...data, entry, ...subs])
    parsed.set(f, parse(await readFile(`${dir}/${f}`, "utf8"), name));

  // The extra file is parsed like any other, so its imports join the one block
  // at the top rather than sitting halfway down the file.
  let extra = null;
  try {
    extra = parse(await readFile(`framer/extra/${name}.tsx`, "utf8"), name);
  } catch {}
  if (extra) parsed.set(`framer/extra/${name}.tsx`, extra);

  const imports = importBlock(
    [...parsed.values()].flatMap((p) => p.imports),
    name,
  );

  const parts = [];
  for (const f of data) parts.push(divider(`${dir}/${f}`), unexport(parsed.get(f).body));
  parts.push(parsed.get(entry).body);
  for (const f of subs) parts.push(divider(`${dir}/${f}`), unexport(parsed.get(f).body));

  if (extra) parts.push(divider(`framer/extra/${name}.tsx — Framer only`), extra.body);

  const sources = [...data, entry, ...subs].map((f) => `${dir}/${f}`);
  const header =
    `// @ts-nocheck\n` +
    `// Generated by scripts/build-framer.mjs — do not edit. Edit the source and\n` +
    `// re-run \`pnpm build-framer\`, then paste this into Framer.\n` +
    `//\n` +
    `// Plain JavaScript in a .tsx file, because Framer's code editor only makes\n` +
    `// .tsx. Nothing here is typed, and the imports resolve inside Framer rather\n` +
    `// than in this repo, so the checker has nothing useful to say about it.\n` +
    `//\n` +
    sources.map((s) => `//   ${s}\n`).join("") +
    (extra ? `//   framer/extra/${name}.tsx  (Framer only)\n` : "") +
    `//\n` +
    `// Paste Primitives.tsx and GlobalStylesheet.tsx before this one.\n`;

  return `${header}\n${imports}\n\n${parts.join("\n\n")}\n`;
}

let stale = 0;
for (const name of only.length ? only : SECTIONS) {
  const out = await build(name);
  const file = `framer/${name}.tsx`;
  const prev = await readFile(file, "utf8").catch(() => null);
  if (prev === out) { console.log(`  ok      ${file}`); continue; }
  stale++;
  if (check) console.log(`  STALE   ${file}`);
  else { await writeFile(file, out); console.log(`  written ${file}`); }
}

if (check && stale) {
  console.log(`\n${stale} file(s) out of date. Run \`pnpm build-framer\`.`);
  exit(1);
}
if (!check && stale) console.log(`\nre-paste into Framer: ${stale} file(s) above.`);
