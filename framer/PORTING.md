# Framer porting brief

Copy everything below the line into a fresh chat session, and name the section you want
worked on at the end. Most sections are generated now — read **Generating and checking a
port** first.

---

## What we're doing

Porting this Next.js prototype into Framer. Most sections become a Framer **code
component**. Three do not — **Events**, **Instagram** and **Contact** are built natively
in Framer, so the client can edit them without touching code. The Next repo stays the
source of truth; Framer gets copies that live in `framer/`, generated where it can be
and hand-written where it cannot.

The prototype itself is done. Nothing in `app/` or `components/` should be redesigned
during a port. A port is a mechanical translation, and any visual difference from the
Next app is a bug.

**A ported file should differ from its source in its import block and nothing else.**
That is the target the rules below are shaped around: the class names, the markup, the
hooks and the sizing annotation are all written once, in `components/`, and copied
across untouched. `About.tsx` is the worked example — diff it against
`components/About/About.jsx` and the only changes are the imports, the divider above the
folded `StatCounter`, and one dropped `export` keyword. Anything beyond that in a port
is a divergence somebody has to re-read on every sync, so push it into the shared file
or into the source instead.

## How styling works

Framer has no CSS-module support and styled-jsx cannot work there, so all CSS is
compiled into one global sheet:

```
pnpm compile-stylesheet-framer
```

That script (`scripts/compile-stylesheet-framer.mjs`) concatenates `tokens.css`,
`utilities.css`, `globals.css`, `page.module.css` and all 28 component modules into
`framer/happen.css`, plus two Framer outputs:

- **`framer/GlobalStylesheet.tsx`** — the sheet as a template string with an
  `injectHappenCSS()` helper. Pasted as a code file. `Primitives.tsx` imports it and
  calls it at module level, and every section imports `Primitives.tsx`, so no section
  needs to call it itself. This is what styles the **canvas**, where custom code does
  not run.
- **`framer/GlobalStylesheetHead.html`** — the same sheet as a `<style>` block, plus
  preloads for the self-hosted Inter and the ribbons (the page's largest paint). Pasted into **Site Settings → Code** as the entry named
  `GlobalStylesheetHead`, at **Start of `<head>`**. This is what styles the **published site**.

Both are minified with lightningcss, 72 kB down to 42 kB, and the native nesting the
`.module.css` files are written in is flattened on the way, which moves the floor from
Safari 16.5 to Safari 16. The .tsx is minified for a reason worth knowing: Framer's JS
minifier cannot reach inside a string literal, so whatever sits in that template is byte
for byte what the page bundle carries. Neither file is meant to be read. `happen.css`
is the same CSS with its comments and source banners intact, and it is the one to open
when you need to see what a rule does.

Both are needed, because they cover different moments. Framer server-renders the
component markup, so a sheet that only arrives with the JS bundle paints raw unstyled
HTML first — measured at roughly two seconds on a throttled connection. In the head the
sheet blocks that first paint the way any stylesheet does, and `injectHappenCSS()` sees
the `data-happen-static` marker and stands down.

## Keeping Framer in sync with the repo

Every file in `framer/` is stamped, so the copy pasted into Framer can be matched against
the repo without diffing 42 kB by eye.

The three generated files carry `Generated <date> · <build>`. The build id is one hash of
the compiled sheet, shared by all three, so two files with the same id came from the same
CSS. The date only moves when the file's content actually changes, which is what makes it
worth reading: regenerating an unchanged sheet keeps the old date and leaves the working
tree clean. The compile script prints the build id and says which files it updated, then
names the ones to re-paste.

The head stamp is also on the marker attribute, as
`data-happen-static="<date> · <build>"`. View source on the published URL and read it
there to confirm which build is actually live, rather than trusting that the paste went
through.

One caveat on that id: it hashes the sheet **before** minification, comments and source
banners included, so editing a comment in any `.module.css` moves it while the CSS that
actually ships is unchanged. A mismatched id is a reason to look, not proof of a stale
paste. To settle it, pull the `<style data-happen-static>` block off the live page and
compare it against the one in `GlobalStylesheetHead.html` — identical content means
there is nothing to re-paste however far apart the ids have drifted. That happened on
2026-09-27: the live page read `3ccacef6` against the repo's `914ec9aa`, and both style
blocks were 41,627 characters with no rule differing and identical preloads.

Generated section files carry no date. They carry a "do not edit" banner and the list of
sources they were built from, and `pnpm build-framer --check` is what says whether the
committed copy is current — a stamp cannot rot if nothing has to remember to update it.
The eight hand-written files still carry `// Last changed <date>` on line 2. That line
did rot: on 2026-09-23 eleven of fourteen ports were stamped older than their source,
which is why most of them are generated now.

Limit the `GlobalStylesheetHead` entry's **Page** field to the Happen pages
(`/home-static`, `/home-editable`) rather than leaving it site-wide. The reset in
`globals.css` is unscoped, so site-wide it would restyle every other page on
happengroup.com.au.

All 228 class names are already globally unique and camelCase-prefixed by stylesheet
(`heroSection`, `navUnderline`, `artistCardWrap`). The script hard-fails if two
stylesheets ever define the same name, or if JSX references a `styles.X` that no rule
defines. Re-run it after touching any CSS, then re-paste both `GlobalStylesheet.tsx` and
`GlobalStylesheetHead.html`.

## Generating and checking a port

Most sections are no longer written by hand. Two commands:

```
pnpm build-framer          regenerate framer/*.tsx from components/
pnpm build-framer --check  fail if a committed copy is out of date
pnpm compare-framer        diff every section on / against /framer/ in a browser
```

`build-framer` concatenates a section's folder into one file, rewrites the import
block onto `./Primitives.tsx`, drops `export` from the folded parts and appends
`framer/extra/<Name>.tsx` if it exists. Eleven sections are generated: About, Artists,
Contact, Events, Hero, Hosts, Instagram, Services, Testimonials, Vendors, Work. **Never
edit those by hand** — the header says so and the next run overwrites it. Edit the
source.

`compare-framer` needs `pnpm dev` running. It fetches both pages, unhashes the CSS-module
class names so the two are directly comparable, strips the asset host, and diffs each
top-level block of `<main>`. A port is a mechanical translation, so anything it reports
is drift. It found three real bugs the day it was written: Contact still carried two
email addresses the repo had removed, Instagram still rendered the old six-tile grid
after the site moved to EmbedSocial, and `Primitives.tsx` exported four social accounts
where `lib/data.js` has two.

### What still has to be hand-written, and why

| File | Why it cannot be generated |
|---|---|
| `Nav.tsx`, `Ribbons.tsx` | portal out of Framer's container, which moves the DOM. Doing the same in Next would change the Next app. |
| `VideoBackground.tsx` | injects CSS that overrides Framer's page background. Not inert in Next — it would restyle the real page. |
| `EventCard.tsx`, `InstagramCard.tsx` | no source in `components/` at all. Framer-native. |
| `VendorsClosed.tsx` | three lines re-exporting `VendorsClosed` from `Vendors.tsx` — see Vendors below. |

These four still carry `// Last changed <date>` on line 2; update it when you touch one.
They now write their class names as `styles.heroSection` like everything else, which is
not cosmetic: `compile-stylesheet-framer` only checks names written that way, so a typo
in one of them is now a failed build rather than an unstyled element. None of them calls
`injectHappenCSS()` any more either — `Primitives.tsx` does it for everyone.

`compare-framer` watches them the same as the generated ones, except `Nav` and the two
cards: `Nav` is `position: fixed` and outside `<main>`, and the cards have no source to
compare against. Those three are the files to eyeball in Preview.

## Rules for a ported file

These are what the generator does. They matter when you hand-write one of the files
above, or when you change a source in a way the generator has to keep up with.

1. **One file per section.** Its private sub-components, data and hooks are folded in as
   non-exported functions, because Framer lists every export in the Insert panel.
   Data files land above the section and sub-components below it, so a module-level
   constant is always declared before it is read.

   The exception is a sub-component somebody is meant to insert or bind on its own.
   `EventCard.tsx` is in the Insert panel on purpose, because the CMS collection list has
   to render it with its fields bound. `InstagramCard.tsx` is the other one.
2. **`// @ts-nocheck` on line 1**, with the header explaining that this is plain JS in a
   `.tsx` because Framer only makes `.tsx`.
3. **`styles.heroSection` stays exactly as the source writes it.** The
   `import styles from "./X.module.css"` line goes, and `styles` comes from
   `Primitives.tsx` instead, where it is a Proxy answering every string key with its own
   name. The compiled sheet is global, so the class name is already the value.
   `compile-stylesheet-framer` scans `framer/` alongside `components/`, so a `styles.X`
   naming no rule fails the build.
4. **Imports carry the `.tsx` extension**: `from "./Primitives.tsx"`. A capitalisation or
   spelling mismatch makes Framer silently omit the component from the Insert panel.
5. **Animation imports need no rewriting.** The Next app was moved off `motion/react`
   onto `framer-motion@11` on 2026-09-10 precisely so the specifier matches what Framer
   bundles.
6. **Anything that receives a `ref` needs `forwardRef`.** Passing `ref` as a plain prop
   is React 19 only, and Framer may be on 18.
7. **`inert` must be a string, not a boolean.** Use the `inertWhen` pattern from
   `Nav.tsx`. React 18 drops an unknown boolean attribute entirely.
8. **The sizing annotation lives in the source.** Every section's default export in
   `components/` carries it, inert there, and the port copies it across:

   ```
   /**
    * @framerSupportedLayoutWidth any
    * @framerSupportedLayoutHeight auto
    */
   ```

9. **Framer-only code goes in `framer/extra/<Name>.tsx`**, which the generator appends
   and whose imports it merges into the one block at the top. That is where property
   controls live. If something Framer-only cannot be appended — because it belongs
   *inside* the component — then either it moves into the source as inert code, or the
   section comes off the generated list. There is no third option, and no hand-editing
   of a generated file.

   **Prefer moving it into the source.** `next.config.mjs` and `.storybook/main.mjs` both
   alias the bare `framer` specifier onto `lib/framer-render-target.js`, so a source file
   can `import { RenderTarget } from "framer"` and the guard simply never fires outside
   Framer. `components/Work/Work.jsx` does this to switch its sideways-scroll listeners
   off on the canvas. `addPropertyControls` is a no-op in the same shim.

10. **Property controls only where someone edits the thing.** Sections take their content
    from the repo and expose nothing, unless the client has asked to edit that section
    themselves — `Vendors.tsx`, `VendorsClosed.tsx`, `Hosts.tsx` and `About.tsx` are the
    four that have.

    The field defaults go in a `DEFAULTS` object in the **source** file, which
    destructures them as parameter defaults, so the Next copy renders exactly what an
    unconfigured Framer instance does. `addPropertyControls` then goes in the extra file.
    `About.tsx` is the pattern.

    Copy that runs to more than one paragraph goes on **one** textarea control and is
    rendered as one element under `white-space: pre-line`, not split in JS. A blank line
    becomes an empty line box, which is the paragraph gap. `.aboutCopy` is the example.

## Shared code that already exists — do not duplicate

`framer/Primitives.tsx` is imported by every section and already exports:

- `styles` — the identity Proxy standing in for each section's CSS-module import, so
  ported markup keeps the source's `styles.X`. It also calls `injectHappenCSS()` at
  module level on everyone's behalf, which is why `Primitives.tsx` has to be the first
  file pasted: a section pasted against an older copy renders unstyled on the canvas.
- `ASSET_BASE` and `asset()` — every image goes through this. It points at
  `https://happen-prototype.vercel.app`, the prototype's own Vercel deployment, which
  serves `public/` at the site root. Cache headers for `/assets` are in
  `next.config.mjs`. Never hardcode an image URL.
- `EASE` — the shared cubic-bezier used by every animation.
- `SOCIALS` — the four social accounts, label, href and icon. Instagram uses all three
  fields and Contact uses the icon only, which is why it is here rather than folded into
  Instagram.
- `Section` — the layout primitive. Full-bleed outer, centred inner capped at the layout
  max width. Takes a ref.
- `TextXXLarge` … `TextSmall`, `TextOverline`, `ButtonTextLarge`, `ButtonTextMedium`,
  `BadgeText` — all forwardRef.
- `Heading1` … `Heading4`, including the tracking-on-scroll behaviour.
- `ButtonLarge`, `ButtonMedium`, `ButtonOutlineLarge`, `ButtonOutlineMedium`, `Button`.
- `Badge`.
- `Reveal`, `RevealGroup`, `RevealItem` and `useIsoLayoutEffect` — the
  fade-and-rise on scroll, ported out of `components/ui.jsx` with Vendors.

`components/Primitives.js` is the Next-side mirror of that file — a barrel re-exporting
the same names from where they actually live, so both copies of a section import one
specifier and the two import blocks line up. It defines nothing. A new shared primitive
goes in both: the real one in `framer/Primitives.tsx`, a re-export line in
`components/Primitives.js`. Say so when you add one, since `Primitives.tsx` then has to
be re-pasted into Framer.

## Status

**Convergence pass, 2026-09-23.** The port is now mostly generated. What changed:

- `Primitives.tsx` gained the `styles` proxy and a module-level `injectHappenCSS()`, so
  no section calls it itself. Its `SOCIALS` was cut from four accounts to the two
  `lib/data.js` actually has.
- `components/Primitives.js` was added as the Next-side mirror of that file, and every
  section's import block was moved onto it.
- Every section's default export in `components/` carries the sizing annotation.
- `scripts/build-framer.mjs` generates nine of the section files; `scripts/compare-framer.mjs`
  diffs every section against its source in a browser.
- `About.tsx` is the worked example: source and port differ in the import block alone,
  and its heading and copy are on property controls, making it the fourth editable
  section.
- `.storybook/main.mjs` now aliases `framer` the way `next.config.mjs` does, so a source
  file can import `RenderTarget` and still run in Storybook.

`Hosts` and `Vendors` were then converged too: their flattened card slots moved into
`components/*/data.js` as a flat `DEFAULTS` object that the source destructures as
parameter defaults, which is inert in Next and is what the Framer controls read. That
fixed the last two differences — `VendorsClosed` had `href="#"` where the source has the
live form URL, and `Hosts` wrote `target` and `rel` in the other order.

`pnpm compare-framer` now reports **every ported block matching its source.**

`InstagramCard.tsx` is no longer imported by anything: the section moved to the
EmbedSocial feed. It is left in place in case the Framer page still has instances of it,
but it is dead in this repo.

**Pasted and verified, 2026-09-27.** The live page at
`https://happengroup.com.au/home-editable` was compared against the repo and matches:

- The head stylesheet is build `2026-09-24 18:46 UTC · 3ccacef6`, the same one the repo
  holds.
- Hero, Vendors, Hosts, About and Testimonials render markup **identical** to the Next
  app. Work and Services differ only by `srcSet` versus `srcset`, which is React writing
  the attribute the JSX way, not a difference in what is rendered.
- Nav portals into its own `<nav>`, and Ribbons into `#main` — the right target, not
  `body`. Two `<video>` elements, Hero and Artists, so no standalone `VideoBackground`
  instance is left in the stack. Four artist cards, matching the repo. No console errors.
- Both bugs `compare-framer` had found are fixed live: the Vendors CTA is the real form
  URL with no `href="#"` left anywhere, and Contact lists only `hello@happengroup.com.au`.

Comparing markup against the published page takes three normalisations, or everything
looks different for no reason: strip the `<style>` and `<script>` blocks, since the sheet
is inlined in the head and its class names otherwise match every grep; unhash the Next
side's CSS-module names, as `compare-framer` does; and normalise React's serialisation
against Framer's — React writes `<img … />`, `alt=""`, `&#x27;` and `data-active=""`
where the published HTML has `<img …>`, `alt`, `'` and `data-active`. Match blocks by
`id`, not by position: Framer's own wrapper divs mean the two pages have different shapes
above the section elements.

**Still to port:** Preloader. Rough page order is in `app/page.js`.

### The paste, in order

The order is not advice. Fourteen files import `styles` from `Primitives.tsx`, and a
section pasted against a copy that lacks it does not error — it is silently missing from
the Insert panel. When a change touches `Primitives.tsx` or the sheet, it is a full
paste rather than a patch, because everything downstream of them moves at once.

1. **`Primitives.tsx`** first, always.
2. **`GlobalStylesheet.tsx`**.
3. **`GlobalStylesheetHead.html`** into Site Settings → Code, at Start of `<head>`, with
   its Page field limited to the Happen pages. Confirm it landed by viewing source on the
   published URL and searching for `data-happen-static` — the value is the build stamp,
   so the same search says whether the paste is current.
4. The rest, in any order: `Nav`, `Ribbons`, `VideoBackground`, `Hero`, `Hosts`,
   `Vendors`, `VendorsClosed`, `Work`, `Services`, `Artists`, `About`, `Testimonials`,
   `EventCard`.

**Not pasted:** `Events.tsx`, `Instagram.tsx` and `Contact.tsx`, because those three
sections are built natively in Framer — see **Sections Framer owns** below. Nor
`InstagramCard.tsx`, which is dead. Nor `happen.css`, `PORTING.md` or `extra/`, none of
which are Framer files at all: `happen.css` is the readable copy of the sheet, and
`extra/` is generator input that is already folded into the files above.

Then, in the page itself:

- **Delete the standalone `VideoBackground` instance from the page stack.** The video
  moved into the hero on 2026-09-17 and Hero and Artists each render their own now; a
  leftover instance draws a second one.
- **Delete `InstagramCard` and any instances of it.** The section is the EmbedSocial feed
  now, and `.instagramCard` / `.instagramCardImage` are no longer in the sheet at all, so
  those tiles would render unstyled. Done as of 2026-09-27; nothing on the live page uses
  it.
- `VendorsClosed` stays as it is in the page. The new `VendorsClosed.tsx` re-exports the
  component from `Vendors.tsx`, so the existing instance keeps resolving.

Worth an eye in Preview afterwards, since `compare-framer` cannot see them: the nav bar
and its blend over the cream sections, the ribbons over the hero, and the event cards.
On the canvas, Instagram should be a plain charcoal block — `EmbedSocialFeed` is guarded
by `RenderTarget` so the vendor script never loads into the editor.

### Vendors

The vendors band has two states, and they are two components so that swapping them is a
swap in the page stack:

- **`Vendors`** — applications open. A card per festival, edited from the section's own
  properties panel: heading, body, and two `{ name, logo, CTA, link }` slots. A slot with
  an empty name is not rendered. Two fixed slots rather than an Array control, because
  the on-page editor lists no Array control; a third card would scroll the row sideways
  on desktop anyway, which the layout was never drawn for.
- **`VendorsClosed`** — between intakes. Same shell, same `#a-vendors` id, same backdrop;
  the card row becomes one card with a generic message and a CTA to an
  expression-of-interest form.

Both come from one source file, `components/Vendors/Vendors.jsx`, so both land in
`framer/Vendors.tsx` with their own property controls. `framer/VendorsClosed.tsx` is kept
as a re-export of it, so the instance already placed in the Framer page still resolves
rather than having to be deleted and re-inserted.

The closed card takes the footprint the card row takes — two cards plus the gap, so 572px
at 1024px and 740px from 1200px — which is why the band keeps its height and proportions
whichever one is in the stack.

The closed card, like `.hostsCard`, is a flat charcoal background. Both used to carry
their own copy of the band backdrop under a `mix-blend-mode: darken` fill; that was
dropped for the plain background, so there is no blend left to break inside Framer's
container.

### Sections Framer owns

Three sections are built in Framer rather than pasted, so the client can edit them
without code. Their `.tsx` files stay in the repo as a reference for layout and
placeholder content, and `compare-framer` still holds them to the source — useful as a
spec, but it no longer describes the live page.

- **Events** — a CMS collection, so the client adds events themselves. It renders
  `EventCard.tsx`, which *is* pasted: one card, every field on a property control, placed
  as instances inside a native card container. The sold-out treatment lives in the card.
  Measured on the live site 2026-09-27: four cards from the collection against eight
  placeholders in `components/Events/data.js`, which is the expected difference.
- **Instagram** — a native frame holding a rich-text heading and a Framer Embed element
  wrapping the EmbedSocial `data-ref`. Two things follow from it being native: the
  section carries no `a-instagram` id, which is harmless because nothing links to it, and
  it takes none of `.instagramSection` / `.instagramContent` from the sheet, so its
  layout is whatever the Framer frame sets. The embed itself works — the iframe resizes
  to its content and loads the feed.
- **Contact** — a native frame. The form, the email and the acknowledgement on the live
  page are Framer elements, not `Contact.tsx`, so none of `.contactSection`,
  `.contactForm`, `.contactEmail` or `.contactSocials` appears there.

If any of the three is ever switched back to the code component, paste its file and
delete the native frame; the ids and copy already match.

#### Events layer structure

The same on every breakpoint:

```
Events (Framer)          native Section, detached
├─ Stack                 heading
└─ Grid / Stack          card container — settings below
   └─ EventCard × n
```

The card container's settings differ per breakpoint. Recorded 2026-09-13 from the
Framer canvas:

| Setting | Desktop (1200px+) | Tablet (768–1199px) | Phone (0–767px) |
|---|---|---|---|
| Layout type | Grid | Stack, horizontal | Stack, horizontal |
| Columns × rows | 3 × 2, masonry off | — | — |
| Distribute / align | — | Start / center | Start / center |
| Wrap | — | No | No |
| Gap | 32 × 32 | 32 | 32 |
| Padding (T R B L) | 0 | 0 64 120 64 | 0 32 80 32 |
| Width | 1fr, Fill | 1fr, Fill | 1fr, Fill |
| Height | Fit | Fit | Fit |
| Max width | 1200, Fixed | 1200, Fixed | 1200, Fixed |
| Overflow | Scroll | Scroll | Scroll |
| Radius | 0 | 0 | 0 |

On Tablet and Phone the side padding matches the Section's own padding (64 and 32), so
the row scrolls to the screen edges while the first card still lines up with the
heading. The bottom padding (120 and 80) is the Section's bottom padding, moved inside
the scroller.

Two things to know when changing these:

- **Framer's desktop breakpoint starts at 1200px; the stylesheet's starts at 1024px.**
  Between 1024 and 1199px Framer shows the Tablet stack while `.eventsCard` has the
  desktop rules, so cards sit at their 381px cap rather than the fluid clamp() width.
- **Keep the container height on Fit.** The card's height comes from its width and the
  360/457 aspect-ratio, so it changes with the viewport. Tablet and Phone were first set
  to fixed heights (520 and 390), which were too short at some widths — 41px short at
  1100px, 15px at 700px — and with Overflow on Scroll the row then scrolled vertically as
  well, hiding the tops of the cards. Fit sizes the container to card plus padding.

## Verification before handing a file over

Four commands, and the first three are the ones that actually catch things:

```
pnpm compile-stylesheet-framer   every styles.X must name a rule that exists
pnpm build-framer --check        no generated file may be stale
pnpm dev + pnpm compare-framer   every section must match its source in the browser
pnpm build && pnpm lint
```

- `compile-stylesheet-framer` scans `components/` and `framer/` together and refuses to
  write if a `styles.X` names no rule, or if two stylesheets define the same class. This
  is why the hand-written files were moved onto `styles.X` too — a plain string is not
  checked by anything.
- Every `asset()` path must exist under `public/`.
- `pnpm build` and `pnpm lint` must still pass. The `framer/` folder is excluded from
  both `jsconfig.json` and `.eslintrc.json`, so nothing in it should ever break the Next
  build — but the `components/` side of a change certainly can. Note that turbopack
  (`pnpm dev`) and webpack (`pnpm build`) disagree about CSS modules: a top-level
  `:global(#id)` in a `.module.css` passes in dev and fails the production build, so a
  green dev server is not the same as a green build.

## Known Framer behaviour, so it isn't mistaken for a bug

- A frame positions children absolutely until you give it a Layout of Stack. Set the
  page frame to a vertical stack with gap 0 and Height auto, and set each component's
  Width to Fill.
- `Nav` measures as zero height, because both its bars are `position: fixed`.
  `NavPlaceholder` is what reserves the space.
- **Fixed positioning and `mix-blend-mode` both break inside Framer's component
  containers, so the nav portals into `document.body`.** A transformed ancestor turns
  `position: fixed` into `position: absolute`, and a blend reaches no further than the
  nearest ancestor opening a stacking context. Framer gives its containers a z-index of
  their own — the one around the nav measured at `position: relative; z-index: 5` — which
  boxes the blend into a group holding nothing but the nav. `difference` then has a
  transparent backdrop and does nothing: the bar renders plain white over a cream section
  instead of inverting, and the hue guard has nothing to correct. It looks like the guard
  has broken; the guard is fine and the bar underneath it never blended. Nothing about
  the container is ours to control, so do not try to unset its z-index — portal out.
- **The backdrop has to live below zero, and a positive scale will not work.** Framer
  wraps every section in divs of its own and gives them whatever z-index it likes —
  measured on the published page, the wrapper holding the entire site is `z-index: auto`
  while one of its own children is `z-index: 3`. Nothing can be ordered against that
  reliably, so a video at 1 and ribbons at 2 simply paint over the site. A negative level
  sits under every in-flow block whatever its wrapper does, which is why the video is at
  -2 and the ribbons at -1.
- **Set the page background colour in Framer; the published page takes it back off.** A
  negative level paints behind the root element's background but still in front of any
  in-flow block's background, so an opaque page background hides the backdrop. Framer
  puts that colour in two places: on `body`, via a rule written `html body`, and on the
  single wrapper div inside `#main`. `VideoBackground.tsx` moves it to `html`, where it
  becomes the canvas, and clears both — with `!important`, and matching `html body`
  rather than `body`, because a bare `body` rule loses on specificity and does nothing at
  all. That override runs only on the published page, so the editor keeps the colour and
  stays usable.
- **Framer has no `.pageMain`, and two components depend on it.** In the Next app
  `<main class="pageMain">` is `position: relative` with no z-index. Positioned, because
  it is the box the ribbons sheet is measured against. No z-index, because it must not
  open a stacking context: the sheet at -1 and the video at -2 are ordered against the
  root, and a context here would trap the sheet above the video. The whole scale lives
  in the root — video -2, ribbons -1, page content and sections 0, mobile overlay 4, nav
  5, nav hue guard 6, preloader 7. The sheet gives `#main` that position (in
  `app/page.module.css`); nothing may add a z-index to it.
- **The video is not portalled; it renders inside the scene of the section that owns it.**
  `VideoBackground.tsx` has no default export — Hero and Artists import it and drop it
  into their own `heroScene` / `artistsScene`, where it is `position: absolute` with a
  sticky viewport. That holds only while every wrapper between the scene and the root is
  `z-index: auto` with no transform, and while none of them is a scroll container.
  Measured on the published page on 2026-09-17: Hero's container and the page wrapper are
  both `position: relative; z-index: auto`, and the page wrapper is `overflow: clip`,
  which is not a scroll container, so the sticky still pins to the screen. The nav
  placeholder sits inside that same wrapper, so Hero's `behindNav` overhang is not
  clipped. If the ribbons ever vanish over the hero, or the video scrolls away with it,
  re-measure those wrappers first.
- **Pick a portal target by what the element is measured against, not just to escape a
  transform.** Nav is sized to the viewport, so it portals to `document.body`. The ribbons sheet has a percentage height and a percentage travel
  resolved against the page, so body would have given it 70vh of art pinned near the top
  of the document — visibly wrong, and wrong in a way that still looks deliberate. It
  portals into `#main` instead.
- On the canvas, `document.body` is the Framer editor itself, so a component that
  portals a fixed full-screen layer there covers the whole UI. Guard the portal with
  `RenderTarget.current() === RenderTarget.canvas` and render in place instead.
- **On-page editing (the live-site editor) only lists simple controls.** An Array control
  never appears there, and neither did a Boolean, so a code component meant to be edited
  that way puts every field on its own control. `Hosts.tsx` and `Vendors.tsx` flatten
  their cards into two fixed slots for this reason, since a third breaks the layout. A
  Hosts slot with an empty title, or a Vendors slot with an empty name, is not rendered.
- A code file that fails to compile is omitted from the Insert panel silently. If a
  component does not appear, read the error strip in Framer's code editor first.
- A published page that flashes unstyled markup has stale or missing head custom code.
  Check it by viewing source on the live URL and searching for `data-happen-static`: it
  has to be in the HTML the server sends, not added later by script. Its value is the
  build stamp, so the same search says whether the paste is current.
- A page with only a desktop canvas publishes as `<meta name="viewport" content="width=1200">`,
  so phones render it scaled down and none of the `max-width` media queries in the sheet
  ever fire. Adding a second canvas is what switches Framer to `width=device-width`. The
  phone canvas needs nothing in it but the same components at Fill width, since the
  breakpoints live in the CSS. Framer mounts each code component once and styles it per
  breakpoint, so a second canvas does not duplicate the DOM or double up scroll listeners.

---

**Work on the `<SECTION NAME>` section.** If it is on the generated list, change the
source under `components/<SECTION>/` and run `pnpm build-framer` — never edit
`framer/<SECTION>.tsx`. If it is hand-written, edit it directly and update its
`// Last changed` line. Either way, finish with `pnpm dev` and `pnpm compare-framer`,
and tell me what to paste, in what order, and what to check in Preview.
