# Happen — Next.js

Static marketing site for **Happen**, a Melbourne events agency. Ported from the
original prototype to **Next.js (App Router, JavaScript)** with **[motion.dev](https://motion.dev)**
driving every scroll animation. Styling is 100% inline (1:1 with the original).

## Stack

- Next.js 15 (App Router) — configured for **static export** (`output: "export"`)
- React 19
- `motion` (motion.dev / Framer Motion) for scroll & reveal animations
- Google **Inter** via `next/font`
- pnpm

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build a static site

```bash
pnpm build        # emits ./out — a fully static site
```

Serve `./out` with any static host.

---

## Deploy

### Vercel (recommended, zero config)

1. Push this folder to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset **Next.js** is detected automatically — deploy.

No env vars needed (the site is served from the domain root).

### GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`.

1. Push to a GitHub repo (branch `main`).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` builds and deploys automatically.

The workflow builds with `NEXT_PUBLIC_BASE_PATH=/<repo>` so assets resolve under
`https://<user>.github.io/<repo>/`. **If this is a root user/org site** (a repo
named `<user>.github.io`), remove the `env:` block from the workflow so the
base path stays empty.

### Custom domain

Set `NEXT_PUBLIC_BASE_PATH` to empty (default) and point your domain at the host.
For GitHub Pages, add a `CNAME` file to `public/` with your domain.

---

## Project structure

```
app/
  layout.js          # <html>, Inter font, metadata
  page.js            # section order
  globals.css        # resets, marquee keyframes
components/
  ui.jsx             # Reveal + SectionHead helpers, viewport hooks
  Nav.jsx            # fixed nav, mix-blend, active-section tracking
  Hero.jsx           # video bg, rolling logo, letter-spacing reveal, marquee
  Services.jsx       # sticky card + scroll-driven active row
  Work.jsx           # horizontal pinned scroll
  Testimonials.jsx   # stacking pinned cards
  Artists.jsx        # 3D scatter pin
  Venues.jsx  About.jsx  WhatsOn.jsx  Traders.jsx
  Suppliers.jsx  Instagram.jsx  Contact.jsx
lib/
  data.js            # all copy/content + asset() base-path helper
public/
  assets/  uploads/  # images + hero video
```

## Notes

- All content lives in `lib/data.js` — edit copy, artists, clients, etc. there.
- Reference assets through `asset("/assets/…")` so the base path stays correct on
  both Vercel (root) and GitHub Pages (sub-path).
- Animations are tuned to closely match the original prototype; the artist-card
  auto-scroll and testimonial stack use `motion`'s `useScroll`/`useTransform`.
