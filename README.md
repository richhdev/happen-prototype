# Happen Group – prototype

The one-page website for [Happen Group](https://happengroup.com.au), built as a Next.js prototype and then ported into Framer, where the live site is built and published.

This repo is the source of truth. Design changes go into the Next app first and are then copied across to Framer.

## URLs

|                           |                                             |
| ------------------------- | ------------------------------------------- |
| Production (Framer)       | https://happengroup.com.au                  |
| Prototype (Vercel)        | https://happen-prototype.vercel.app         |
| Framer components preview | https://happen-prototype.vercel.app/framer/ |

The Vercel deployment also hosts the images and fonts for the Framer site, served from
`/assets/`. If you rename or delete something in `public/assets`, the live site loses it too.

## What's in the project

### The Next.js app

The prototype itself: a single page made up of sections.

- `app/`: the App Router. `page.js` puts the sections in order. `layout.js` holds metadata,
  and `robots.js` and `sitemap.js` are here too. The favicon, Apple icon and share images
  are also here.
- `app/styles/`: `tokens.css` (design tokens) and `utilities.css`, which `globals.css`
  loads alongside the fonts.
- `components/`: one folder per section (Hero, Events, Work, Services, Artists, …) and
  shared pieces (Section, Heading, Text, Button, Badge). Each component has a matching
  `.module.css`.
- `lib/`: the site URL and name (`site.js`), shared data and easing (`data.js`), and a
  stand-in for Framer's `RenderTarget` so the Framer files can run in Next.
- `public/assets/`: the images, video and fonts that ship. These are generated, so don't
  edit them by hand (see `pnpm assets`).
- `source-assets/`: the original Figma exports that `public/assets` is built from. Its
  [README](source-assets/README.md) covers export sizes.
- `docs/`: notes, such as how the fluid `clamp()` font sizes are worked out.

Every class name is unique across all stylesheets, and the name starts with its file's
name (`.heroSection`, `.sectionInner`). This matters because Framer loads all the CSS as a
single global sheet.

### Framer components and preview

- `framer/`: copies of each section as Framer code components. You paste these into
  Framer by hand. Every section is a code component except Events, which is a Framer
  CMS collection so the client can add events themselves.
  [PORTING.md](framer/PORTING.md) is the porting brief and explains how to keep Framer
  in sync.
- `framer/GlobalStylesheet.tsx`, `GlobalStylesheetHead.html`, `happen.css`: all the
  prototype's CSS combined into one sheet. `pnpm compile-stylesheet-framer` generates
  these files, so don't edit them by hand.
- `app/framer/`: the preview page at `/framer/`. It renders the `framer/` files inside
  Next so you can compare them against the real page before pasting them into Framer.
  Search engines don't index it.

### Storybook

Stories live next to their components as `*.stories.jsx` (currently Heading and Text),
and config lives in `.storybook/`.

## Getting started

```sh
pnpm install
pnpm dev
```

Use pnpm only. `pnpm assets` needs `cwebp` (`brew install webp`).

## Scripts

| Script                           | What it does                                                                                                                                                                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                       | Starts the Next dev server with Turbopack at http://localhost:3000.                                                                                                                                                                                                         |
| `pnpm dev:lan`                   | Same, but listens on your local network at port 3100 so you can open it on a phone (`http://<your-ip>:3100`). Works for addresses from `192.168.1.*`.                                                                                                                       |
| `pnpm build`                     | Makes a production build. Don't run it while the dev server is up, because they both write to `.next/`.                                                                                                                                                                     |
| `pnpm start`                     | Serves the production build.                                                                                                                                                                                                                                                |
| `pnpm lint`                      | Runs Next's ESLint.                                                                                                                                                                                                                                                         |
| `pnpm screenshot`                | Takes Playwright screenshots of the running dev server, desktop (1440) and mobile (390), saved to `.screenshots/`. Flags: `--path`, `--w`/`--h`, `--scroll`, `--click`, `--section`, `--settle`, `--full`, `--name`.                                                        |
| `pnpm assets`                    | Builds `public/assets/` from `source-assets/`. Converts PNG and JPG to WebP (plus `-mobile` versions for ribbons, work and services) and copies SVG and WebP files as they are. Only rebuilds files whose source is newer. Use `pnpm assets --force` to rebuild everything. |
| `pnpm compile-stylesheet-framer` | Combines every stylesheet into `framer/happen.css`, `GlobalStylesheet.tsx` and `GlobalStylesheetHead.html`. Fails if a class name appears in two stylesheets, or if the JSX uses a `styles.X` that no stylesheet defines.                                                   |
| `pnpm lighthouse`                | Runs a headless Lighthouse audit against http://localhost:3000 and opens `.lighthouse/report.html`. Run it against `pnpm build && pnpm start` for realistic numbers.                                                                                                        |
| `pnpm storybook`                 | Starts Storybook at http://localhost:6006.                                                                                                                                                                                                                                  |
| `pnpm build-storybook`           | Builds a static Storybook into `storybook-static/`.                                                                                                                                                                                                                         |

You run one script directly, without pnpm:

- `node scripts/generate-icons.mjs` rebuilds the favicon, Apple icon and share images in
  `app/`, and the light and dark Framer favicons in `framer/`, from
  `source-assets/site-icons/`.
