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
`framer/happen.css`, plus `framer/GlobalStylesheet.tsx`, which is the same text as a
template string with an `injectHappenCSS()` helper. Every Framer code component imports
that and calls it at module level. Framer's Site Settings custom code is deliberately
not used, because it does not run on the Framer canvas.

All 223 class names are already globally unique and camelCase-prefixed by stylesheet
(`heroSection`, `navUnderline`, `artistCardWrap`). The script hard-fails if two
stylesheets ever define the same name, or if JSX references a `styles.X` that no rule
defines. Re-run it after touching any CSS, then re-paste `GlobalStylesheet.tsx`.

## Rules for a ported file

1. **One file per section.** Fold its private sub-components, data and hooks in as
   non-exported functions. Framer lists every export in the Insert panel, so only the
   section itself is exported. Nav absorbed six source files this way; Hero absorbed
   three.
2. **`// @ts-nocheck` on line 1**, with the standard four-line header explaining that
   this is plain JS in a `.tsx` because Framer only makes `.tsx`.
3. **Drop `import styles from "./X.module.css"`** and rewrite every `styles.heroSection`
   as the plain string `"heroSection"`.
4. **Imports carry the `.tsx` extension**: `from "./Primitives.tsx"`. A capitalisation
   or spelling mismatch makes Framer silently omit the component from the Insert panel
   rather than showing an error.
5. **`motion/react` becomes `framer-motion`.** Framer bundles it.
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

## Shared code that already exists — do not duplicate

`framer/Primitives.tsx` is imported by every section and already exports:

- `ASSET_BASE` and `asset()` — every image goes through this. It points at
  `https://happen-prototype.vercel.app`, the prototype's own Vercel deployment, which
  serves `public/` at the site root. Cache headers for `/assets` are in
  `next.config.mjs`. Never hardcode an image URL.
- `EASE` — the shared cubic-bezier used by every animation.
- `Section` — the layout primitive. Full-bleed outer, centred inner capped at the layout
  max width. Takes a ref.
- `TextXXLarge` … `TextSmall`, `TextOverline`, `ButtonTextLarge`, `ButtonTextMedium`,
  `BadgeText` — all forwardRef.
- `Heading1` … `Heading4`, including the tracking-on-scroll behaviour.
- `ButtonLarge`, `ButtonMedium`, `ButtonOutlineLarge`, `ButtonOutlineMedium`, `Button`.
- `Badge`.

If a section needs a new shared primitive, add it to `Primitives.tsx` and say so, since
that file then has to be re-pasted into Framer.

**Not yet ported and needed by eight sections:** `components/ui.jsx`, which exports
`Reveal`, `RevealGroup`, `RevealItem` and `useIsoLayoutEffect`. Contact, Events, Hosts,
Instagram, Services, Vendors, Venues and Work all use it. It belongs in
`Primitives.tsx`. Port it on the first section that needs it.

## Status

**In Framer and working:** `GlobalStylesheet.tsx`, `Primitives.tsx`, `Nav.tsx`,
`Hero.tsx`.

**Still to port:** Ribbons, Vendors, Work, Services, Artists, Venues, About,
Testimonials, Hosts, Instagram, Contact, Preloader, VideoBackground. Events is skipped
on purpose. Rough page order is in `app/page.js`.

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
- Fixed positioning and `mix-blend-mode` break under a transformed ancestor. If the nav
  scrolls away with the page, or its red text renders green, a Framer wrapper has a
  transform and the fix is a portal into `document.body`.
- A code file that fails to compile is omitted from the Insert panel silently. If a
  component does not appear, read the error strip in Framer's code editor first.

---

**Port the `<SECTION NAME>` section.** Read the files under `components/<SECTION>/`,
follow the rules above, and write `framer/<SECTION>.tsx`. Tell me what to paste and in
what order, and anything I should check in Preview.
