// Give every CSS-module class a globally unique name: `.section` in Hero.module.css
// becomes `.heroSection`, and `styles.section` becomes `styles.heroSection`.
//
// The name is camelCase — the stylesheet's name with a lowercase first letter, then the
// class name with a capital: ArtistCard.module.css yields `.artistCardImage`. No
// separator, so the result stays a valid JS property and `styles.x` dot syntax keeps
// working. (A dash would force `styles["artist-card-wrap"]` everywhere, since Next
// doesn't turn on css-loader's camelCase export.)
//
// A class already starting with its own prefix is left alone — `.navPlaceholder` in
// Nav.module.css stays put rather than becoming `.navNavPlaceholder`. It already reads
// as part of the same set.
//
// This buys nothing for the Next app — CSS modules already scope these. It's for the
// Framer port. Framer has no CSS-module support, so each component's CSS goes in as a
// plain global stylesheet, and at that point module scoping is gone. 32 names collided
// across the 27 stylesheets, and three of them (`.section`, `.inner`, `.badge`) landed
// *both* classes on a single element via the Section and Badge primitives, where the
// merge would have resolved by injection order.
//
//   node scripts/prefix-classes.mjs            rename in place
//   node scripts/prefix-classes.mjs --dry      report only, write nothing
//   node scripts/prefix-classes.mjs --list     also print every rename
//
// Idempotent — a second run is a no-op, so it's safe to re-run after adding a component.
//
// The script will not write unless it can prove the rename was lossless: it resolves
// every `styles.X` against the stylesheet its file imports, before and after, and
// aborts if either the reference count or the resolved count moves.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const DRY = process.argv.includes("--dry");
const LIST = process.argv.includes("--list");

const ROOTS = ["components", "app"];
const SKIP = new Set(["node_modules", ".next", ".git"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (/\.module\.css$|\.jsx?$/.test(entry.name)) out.push(path);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r)).sort();
const cssFiles = files.filter((f) => f.endsWith(".module.css"));
const jsFiles = files.filter((f) => /\.jsx?$/.test(f));

// Spans the rewrite must not touch: comments, quoted strings, url(...) and
// :global(...) — that last one names a class inside the inlined preloader SVG, which
// really is global and has to keep its name.
const PROTECT =
  /\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|url\([^)]*\)|:global\([^)]*\)/g;
const CLASS = /\.([A-Za-z_][\w-]*)/g;
const HOLE = /__HOLE(\d+)__/g;
const IMPORT = /import\s+styles\s+from\s+"\.\/([\w.-]+)\.module\.css"/;

// Hero -> "hero", ArtistCard -> "artistCard". Both the stylesheet side (from the
// filename) and the JS side (from the import path) have to derive the prefix through
// this, or the two halves of the rename drift apart.
const lowerFirst = (name) => name[0].toLowerCase() + name.slice(1);
const upperFirst = (name) => name[0].toUpperCase() + name.slice(1);
const prefixOf = (f) => lowerFirst(basename(f, ".module.css"));

// The naming rule, in one place — both halves of the rewrite go through this, so the
// stylesheet and the JS that reads it can't drift apart. Idempotent: a name that
// already carries the prefix comes back unchanged.
// A class named exactly after its stylesheet (`.artistCard` in ArtistCard.module.css)
// counts as prefixed too, or a second run would grow it into `.artistCardArtistCard`.
// A digit ends the prefix as clearly as a capital does, so `.heading1` stays put.
const isPrefixed = (name, p) =>
  name.startsWith(p) && (name.length === p.length || /[A-Z0-9]/.test(name[p.length]));
const qualify = (p, name) => (isPrefixed(name, p) ? name : p + upperFirst(name));
const read = (f) => readFileSync(f, "utf8");

// A reference in JS, in either notation. Both are matched so the rewrite can normalise
// `styles.foo` into `styles.heroFoo` and then leave it alone on a second run.
const REF = /styles\.([A-Za-z_][\w$]*)|styles\[(?:"([^"]+)"|'([^']+)')\]/g;
const nameOf = (m) => m[1] ?? m[2] ?? m[3];

/** Which classes each stylesheet defines, keyed by its basename. */
function definitions(contents) {
  const map = new Map();
  for (const f of cssFiles) {
    const bare = contents.get(f).replace(PROTECT, " ");
    const set = new Set();
    for (const m of bare.matchAll(CLASS)) set.add(m[1]);
    map.set(prefixOf(f), set);
  }
  return map;
}

/** Every `styles.X` resolved against the stylesheet its file imports. */
function resolution(contents) {
  const defined = definitions(contents);
  let refs = 0;
  let resolved = 0;
  const orphans = [];
  for (const f of jsFiles) {
    const src = contents.get(f);
    const imp = src.match(IMPORT);
    // Deliberately not skipping files whose import didn't parse. Those are exactly the
    // ones the rewrite will have missed, and dropping them here would take their
    // references out of both the before and after counts — hiding the loss from the
    // guard below instead of reporting it.
    const set = imp ? (defined.get(lowerFirst(imp[1])) ?? new Set()) : new Set();
    for (const m of src.matchAll(REF)) {
      const name = nameOf(m);
      refs++;
      if (set.has(name)) resolved++;
      else orphans.push(`${f}  styles.${name}  (not in ${imp?.[1] ?? "?"}.module.css)`);
    }
  }
  return { refs, resolved, orphans };
}

const before = new Map(files.map((f) => [f, read(f)]));

// A file that reads `styles.` but whose import this script can't parse would have its
// stylesheet prefixed and its own references left behind. Refuse to run rather than
// rewrite a file we don't understand.
const unparseable = jsFiles.filter(
  (f) => /styles[.[]/.test(before.get(f)) && !IMPORT.test(before.get(f)),
);
if (unparseable.length) {
  console.error("ABORTED — these files use `styles.` but their import didn't parse:");
  for (const f of unparseable) console.error("  " + f);
  console.error('Expected exactly: import styles from "./Name.module.css";');
  process.exit(1);
}

const after = new Map(before);
const renames = [];

for (const f of cssFiles) {
  const p = prefixOf(f);
  const src = before.get(f);
  const holes = [];
  const masked = src.replace(PROTECT, (m) => "__HOLE" + (holes.push(m) - 1) + "__");
  const out = masked.replace(CLASS, (m, name) => {
    const full = qualify(p, name);
    if (full === name) return m; // already carries the prefix
    renames.push([f, name, full]);
    return "." + full;
  });
  after.set(f, out.replace(HOLE, (_, i) => holes[i]));
}

for (const f of jsFiles) {
  const src = before.get(f);
  const imp = src.match(IMPORT);
  if (!imp) continue;
  const p = lowerFirst(imp[1]);
  after.set(
    f,
    // Dot syntax: the camelCase name is always a valid JS property. Bracketed
    // references are matched too, so a tree left in the old dashed convention
    // normalises back to dots.
    src.replace(REF, (...m) => "styles." + qualify(p, nameOf(m))),
  );
}

// Refuse to write unless the rename provably preserved every reference. An orphaned
// `styles.X` is fine if it was already orphaned — what must not change is how many
// there are.
const a = resolution(before);
const b = resolution(after);
if (a.refs !== b.refs || a.resolved !== b.resolved) {
  console.error("ABORTED — the rename changed reference resolution:");
  console.error(`  before  refs ${a.refs}  resolved ${a.resolved}  orphaned ${a.orphans.length}`);
  console.error(`  after   refs ${b.refs}  resolved ${b.resolved}  orphaned ${b.orphans.length}`);
  for (const o of b.orphans) console.error("  " + o);
  process.exit(1);
}

const changed = files.filter((f) => after.get(f) !== before.get(f));
if (!DRY) for (const f of changed) writeFileSync(f, after.get(f));

const unique = new Map(renames.map(([f, o, n]) => [f + "|" + o, [f, o, n]]));
console.log(
  (DRY ? "DRY RUN — " : "") +
    `${changed.length} files ${DRY ? "would change" : "changed"}, ${unique.size} classes renamed`,
);
console.log(`refs ${b.refs}  resolved ${b.resolved}  orphaned ${b.orphans.length} (unchanged by the rename)`);
for (const o of b.orphans) console.log("  pre-existing orphan: " + o);

// Whole point of the exercise: no name may be defined by two stylesheets.
const owners = new Map();
for (const f of cssFiles) {
  const bare = after.get(f).replace(PROTECT, " ");
  for (const m of bare.matchAll(CLASS))
    (owners.get(m[1]) ?? owners.set(m[1], []).get(m[1])).push(basename(f));
}
const collisions = [...owners].filter(([, fs]) => new Set(fs).size > 1);
console.log(`collisions across stylesheets: ${collisions.length}`);
for (const [name, fs] of collisions) console.log(`  .${name}  ${[...new Set(fs)].join(", ")}`);

if (LIST)
  for (const [f, o, n] of unique.values())
    console.log(`  ${f}  .${o} -> .${n}`);
