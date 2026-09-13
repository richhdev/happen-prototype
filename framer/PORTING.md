# Framer porting brief

Copy everything below the line into a fresh chat session, and name the section you
want ported at the end.

---

## What we're doing

Porting this Next.js prototype into Framer. Every section becomes a Framer **code
component**, except **Events**, which the client rebuilds as a Framer CMS collection so
they can add events themselves. The Next repo stays the source of truth; Framer gets
hand-ported copies that live in `framer/`.

The prototype itself is done. Nothing in `app/` or `components/` should be redesigned
during a port. A port is a mechanical translation, and any visual difference from the
Next app is a bug.

## How styling works

Framer has no CSS-module support and styled-jsx cannot work there, so all CSS is
compiled into one global sheet:

```
pnpm compile-stylesheet-framer
```

That script (`scripts/compile-stylesheet-framer.mjs`) concatenates `tokens.css`,
`utilities.css`, `globals.css`, `page.module.css` and all 27 component modules into
`framer/happen.css`, plus two Framer outputs:

- **`framer/GlobalStylesheet.tsx`** — the sheet as a template string with an
  `injectHappenCSS()` helper. Pasted as a code file; every section imports it and calls
  it at module level. This is what styles the **canvas**, where custom code does not run.
- **`framer/head.html`** — the same sheet as a `<style>` block plus the webfont `<link>`.
  Pasted into the page's **Custom Code → Start of `<head>`**. This is what styles the
  **published site**.

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

Hand-ported sections carry `// Last changed <date>` on line 2 instead, since nothing
generates them. Update that line whenever you change one, or it silently rots.

Paste head.html **per page, not into Site Settings**. The reset in `globals.css` is
unscoped, so site-wide it would restyle every other page on happengroup.com.au.

All 222 class names are already globally unique and camelCase-prefixed by stylesheet
(`heroSection`, `navUnderline`, `artistCardWrap`). The script hard-fails if two
stylesheets ever define the same name, or if JSX references a `styles.X` that no rule
defines. Re-run it after touching any CSS, then re-paste both `GlobalStylesheet.tsx` and
`head.html`.

## Rules for a ported file

1. **One file per section.** Fold its private sub-components, data and hooks in as
   non-exported functions. Framer lists every export in the Insert panel, so only the
   section itself is exported. Nav absorbed six source files this way; Hero absorbed
   three, and `TestimonialsHosts.tsx` six.

   A section is what occupies one slot in the page stack, not what has a folder. Where
   `app/page.js` wraps two components in one `<Section>`, that group is the section and
   the port owns the `<Section>` the page was providing. Testimonials and Hosts are
   flex siblings from 1024px up, and Framer's page frame is a vertical stack, so
   shipping them separately would push that breakpoint onto the canvas.

   The exception is a sub-component somebody is meant to insert or bind on its own.
   `EventCard.tsx` is the only one so far: it is in the Insert panel on purpose, because
   the CMS collection list has to render it with its fields bound. Split a card out only
   when that is true of it, and have the section import the split file rather than
   keeping a second copy of the markup.
2. **`// @ts-nocheck` on line 1**, with the standard four-line header explaining that
   this is plain JS in a `.tsx` because Framer only makes `.tsx`.
3. **Drop `import styles from "./X.module.css"`** and rewrite every `styles.heroSection`
   as the plain string `"heroSection"`.
4. **Imports carry the `.tsx` extension**: `from "./Primitives.tsx"`. A capitalisation
   or spelling mismatch makes Framer silently omit the component from the Insert panel
   rather than showing an error.
5. **Animation imports need no rewriting.** The Next app was moved off `motion/react`
   onto `framer-motion@11` on 2026-09-10 precisely so the specifier matches what Framer
   bundles. If you see `motion/react` anywhere, it is a mistake in the source, not
   something to translate.
6. **Anything that receives a `ref` needs `forwardRef`.** Passing `ref` as a plain prop
   is React 19 only, and Framer may be on 18, where it is silently dropped.
7. **`inert` must be a string, not a boolean.** Use the `inertWhen` pattern from
   `Nav.tsx`. React 18 drops an unknown boolean attribute entirely.
8. **Annotate the export** so Framer sizes it from the CSS, not from a typed number:

   ```
   /**
    * @framerSupportedLayoutWidth any
    * @framerSupportedLayoutHeight auto
    */
   ```
9. **Property controls only where someone edits the thing.** Sections take their content
   from the repo and expose nothing. A component built to be filled in from the panel
   puts every field on `addPropertyControls`, with the default in a `defaultValue` and in
   the parameter default — not in `Component.defaultProps`, which React 19 ignores on a
   function component and warns about. Anything reading Framer's sizing out of `style`
   has to drop the keyword values, or the auto mode overrides the width the stylesheet
   set. `EventCard.tsx` carries both patterns.

## Shared code that already exists — do not duplicate

`framer/Primitives.tsx` is imported by every section and already exports:

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

If a section needs a new shared primitive, add it to `Primitives.tsx` and say so, since
that file then has to be re-pasted into Framer.

## Status

**In Framer and working:** `GlobalStylesheet.tsx`, `Primitives.tsx`, `Nav.tsx`,
`Hero.tsx`, `VideoBackground.tsx`, `Ribbons.tsx`.

**Written, not yet pasted or checked in Framer:** `Vendors.tsx`, `Work.tsx`,
`Services.tsx`, `Artists.tsx`, `Venues.tsx`, `TestimonialsHosts.tsx`, `About.tsx`,
`Instagram.tsx`, `Contact.tsx`, `EventCard.tsx` and `Events.tsx`, along with the
`Primitives.tsx` additions they need: `Reveal` for Vendors, and `SOCIALS` for Instagram
and Contact. `EventCard.tsx` is pasted and in use; `Events.tsx` is not pasted — see
Events below.

The `Primitives.tsx` in Framer is older than the one in this repo and does not export
`EASE`, so anything importing it fails with *does not provide an export named 'EASE'*.
Re-pasting `Primitives.tsx` is the whole fix. It is the file to paste first whenever a
section is pasted, since a section that imports a name the pasted copy lacks does not
appear in the Insert panel.

**Still to port:** Preloader. Rough page order is in `app/page.js`.

### Events

Events is built natively in Framer, not from `Events.tsx`. That file is not pasted into
Framer; it stays in the repo as a reference for the section's layout and placeholder
content. What Framer uses is `EventCard.tsx`: one card, every field on a property
control, placed as instances inside a native card container. The sold-out treatment
lives in the card.

Layer structure, the same on every breakpoint:

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

- Every class name used in the new file must exist in `framer/happen.css`.
- Every `asset()` path must exist under `public/`.
- `pnpm build` and `pnpm lint` must still pass. The `framer/` folder is excluded from
  both `jsconfig.json` and `.eslintrc.json`, so nothing in it should ever break the
  Next build.

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
  5, nav hue guard 6, preloader 7. `VideoBackground.tsx` and `Ribbons.tsx` each give
  `#main` that position, and neither may add a z-index to it.
- **Pick a portal target by what the element is measured against, not just to escape a
  transform.** Nav and the video are sized to the viewport, so they portal to
  `document.body`. The ribbons sheet has a percentage height and a percentage travel
  resolved against the page, so body would have given it 70vh of art pinned near the top
  of the document — visibly wrong, and wrong in a way that still looks deliberate. It
  portals into `#main` instead.
- On the canvas, `document.body` is the Framer editor itself, so a component that
  portals a fixed full-screen layer there covers the whole UI. Guard the portal with
  `RenderTarget.current() === RenderTarget.canvas` and render in place instead.
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

**Port the `<SECTION NAME>` section.** Read the files under `components/<SECTION>/`,
follow the rules above, and write `framer/<SECTION>.tsx`. Tell me what to paste and in
what order, and anything I should check in Preview.
