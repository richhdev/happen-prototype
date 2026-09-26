# Migrating from Vercel to Cloudflare Pages

Moves the site, Storybook and the design system to Cloudflare Pages, and moves the
image/font hosting that the Framer site depends on onto a **client-owned** Cloudflare
account behind a client-owned hostname.

## Why

`public/assets` is the asset host for the live Framer site — all 89 `asset()` calls plus
the Inter woff2 and four ribbon backgrounds in the compiled stylesheet. Today they are
served from a Vercel Hobby deployment on a personal account. Vercel's fair use guidelines
restrict Hobby to non-commercial use and define commercial as including "receiving payment
to create, update, or host the site", so the account that production depends on is one
policy review away from being paused.

The fix is two separate things:

1. The **bytes** move to an account the client owns.
2. The **URL** moves to a hostname the client owns, so the host is swappable by DNS
   instead of by re-pasting every component into Framer.

## What ends up where

| Project           | Cloudflare account | Serves                                  | Domain                      |
| ----------------- | ------------------ | --------------------------------------- | --------------------------- |
| `happen-prototype`| dev (yours)        | static site, `/storybook`, `/design-system` | `*.pages.dev`           |
| `happen-assets`   | client's           | `public/assets` only                    | `cdn.happengroup.com.au`    |

Two projects on purpose. The assets deploy runs no build, so a broken Storybook build can
never take the client's images off the air.

---

## Phase 1 — Dev account, everything, tested

Nothing here touches the client or the live site. Vercel keeps serving assets throughout.

### 1.1 Make the Next app statically exportable

The app has no route handlers, middleware, server actions or ISR, and `next.config.mjs`
already sets `images: { unoptimized: true }` and `trailingSlash: true` — the two things
export needs.

- [ ] Add `output: "export"` to `nextConfig` in `next.config.mjs`.
- [ ] Delete the `headers()` block. Static export ignores it (this is true on Vercel too,
      not a Cloudflare limitation). It is replaced by `public/_headers` below.
- [ ] Delete the `rewrites()` block. It only existed because Next's `public/` has no
      directory index; Cloudflare Pages serves `/storybook/` → `/storybook/index.html`
      natively.

### 1.2 Add `public/_headers`

Replaces the deleted `headers()` block. Cloudflare reads this from the deploy root, and
because both projects serve assets at `/assets/*`, the same file works for both.

```
/assets/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

- [ ] Create `public/_headers` with the above.

> The old `headers()` block skipped itself outside production so re-exported assets would
> not sit stale in the browser during `next dev`. `_headers` is only read by Cloudflare, so
> `next dev` is unaffected and the guard is no longer needed.

### 1.3 Verify the build locally

- [ ] Stop the dev server (`next build` and `next dev` must not share `.next`).
- [ ] `pnpm build`
- [ ] Confirm `out/` contains:
  - `out/index.html`
  - `out/assets/` (153 files)
  - `out/storybook/index.html`
  - `out/framer/index.html`
  - `out/_headers`
  - `out/robots.txt`, `out/sitemap.xml`
- [ ] `npx serve out` and click through the page, `/storybook` and `/framer/`.

### 1.4 Create the dev Pages project

- [ ] `npx wrangler login` (your own Cloudflare account).
- [ ] `npx wrangler pages project create happen-prototype --production-branch main`
- [ ] `pnpm build && npx wrangler pages deploy out --project-name=happen-prototype --branch=main`
- [ ] Open the `*.pages.dev` URL. Check the page, `/storybook`, `/framer/`, and that an
      asset returns the right cache header:

      curl -sI https://happen-prototype.pages.dev/assets/ribbon-1.webp | grep -i cache-control

### 1.5 Wire up CI for the dev project

`.github/workflows/deploy-site.yml`:

```yaml
name: Deploy site
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_DEV_API_TOKEN }}
          accountId: ${{ secrets.CF_DEV_ACCOUNT_ID }}
          command: >-
            pages deploy out --project-name=happen-prototype
            --branch=${{ github.head_ref || github.ref_name }}
```

- [ ] Add `CF_DEV_API_TOKEN` and `CF_DEV_ACCOUNT_ID` as repo secrets.
- [ ] Push and confirm the deploy runs.
- [ ] Open a throwaway PR and confirm it gets its own preview URL. Passing the branch name
      is what produces per-branch previews; without it every deploy lands on production.

### 1.6 Add the design system

- [ ] Put the static build in `public/design-system/` (add to `.gitignore` if it is
      generated, the way `public/storybook/` already is).
- [ ] If it is generated, add its build step to the `build` script in `package.json`
      alongside `storybook build`.
- [ ] Confirm it appears at `/design-system` on the deployed URL.

**Phase 1 is done when** the dev `*.pages.dev` URL serves the site, Storybook, the design
system and the assets correctly, and PRs get preview URLs. Vercel is still live and still
serving the client's assets. Nothing has been pointed anywhere new.

---

## Phase 2 — Client account, tokens, deploy script

Still no change to the live site. This stands up the client-owned host in parallel.

### 2.1 Client Cloudflare account

- [ ] Client creates a free Cloudflare account (or uses an existing one — check first,
      their DNS may already be there, which makes Phase 3 one click).
- [ ] Someone with access runs, or does via the dashboard:

      npx wrangler pages project create happen-assets --production-branch main

### 2.2 Mint a scoped token

In the **client's** account → My Profile → API Tokens → Create Token → Custom token:

- [ ] Permissions: **Account → Cloudflare Pages → Edit**. Nothing else.
- [ ] Account Resources: that account only.
- [ ] Copy the token and the Account ID.

> The token is the access — you never log into their account again after this. It cannot
> read DNS, billing or anything outside Pages, which makes it a much easier ask than being
> added as a user. The client can mint it themselves and send it over if they prefer.

- [ ] Add to this repo's Actions secrets as `CF_CLIENT_API_TOKEN` and
      `CF_CLIENT_ACCOUNT_ID`.

### 2.3 Assets workflow

`.github/workflows/deploy-assets.yml`:

```yaml
name: Deploy assets
on:
  push:
    branches: [main]
    paths: ["public/assets/**", "public/_headers"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Stage assets under /assets
        run: |
          mkdir -p dist/assets
          cp -R public/assets/. dist/assets/
          cp public/_headers dist/_headers
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_CLIENT_API_TOKEN }}
          accountId: ${{ secrets.CF_CLIENT_ACCOUNT_ID }}
          command: pages deploy dist --project-name=happen-assets --branch=main
```

Notes:

- `public/assets` is committed, so this needs no Node, no pnpm and no `cwebp`. It is a
  file upload, which is why it cannot be broken by an app build failure.
- The staging step keeps files at `/assets/*`. That is deliberate: every `asset()` path in
  `framer/Primitives.tsx` starts with `/assets/`, so preserving the segment means the
  migration changes one constant and nothing else. It is also why the hostname is `cdn.`
  rather than `assets.` — `cdn.happengroup.com.au/assets/ribbon-1.webp` reads correctly.
- `--branch=main` marks it a production deploy. Without it wrangler files it as a preview
  and the custom domain will not serve it.

- [ ] Add the workflow, push, confirm it runs.
- [ ] Check the assets on the project's `*.pages.dev` URL, including the cache header and
      the font:

      curl -sI https://happen-assets.pages.dev/assets/fonts/inter-latin-var.woff2

**Phase 2 is done when** every asset resolves on the client's `*.pages.dev` URL with the
right headers. The live site is still pointed at Vercel.

---

## Phase 3 — Custom hostname and cutover

### 3.1 Add the custom domain in Pages

- [ ] Client's account → Pages → `happen-assets` → Custom domains → Set up a domain →
      `cdn.happengroup.com.au`.
- [ ] Cloudflare shows the CNAME target. Note it.

### 3.2 DNS

`happengroup.com.au` currently resolves to Framer, so check where its DNS is actually
hosted — registrar, or Cloudflare.

- [ ] **If DNS is already on Cloudflare in the client's account:** Pages creates the record
      itself. Accept it.
- [ ] **Otherwise:** add `CNAME cdn → happen-assets.pages.dev` at whatever hosts DNS.

Only a subdomain is added. The apex record pointing at Framer is not touched, so the live
site cannot be affected by this step.

- [ ] Wait for the domain to show **Active** in Pages and for the certificate to issue
      (usually minutes).
- [ ] Verify before changing any code:

      curl -sI https://cdn.happengroup.com.au/assets/ribbon-1.webp

      Expect `200`, `content-type: image/webp`, and the cache header.

### 3.3 Flip the asset base

Only now, with the new host proven.

- [ ] In `framer/Primitives.tsx`, change the one constant:

      export const ASSET_BASE = "https://cdn.happengroup.com.au";

- [ ] `pnpm compile-stylesheet-framer`

      The script reads `ASSET_BASE` out of `Primitives.tsx` and refuses to write if it is
      missing, so this rewrites the font and ribbon URLs in `happen.css`,
      `GlobalStylesheet.tsx` and `GlobalStylesheetHead.html` to match. Confirm with:

      grep -rc "happen-prototype.vercel.app" framer/

      Everything but the docs should be 0.

- [ ] Re-paste into Framer: `Primitives.tsx`, `GlobalStylesheet.tsx` and the head HTML.
      See `framer/PORTING.md`.
- [ ] Publish the Framer site.
- [ ] Hard-reload `happengroup.com.au` and confirm in DevTools → Network that every image
      and the font come from `cdn.happengroup.com.au` and none from `vercel.app`.

### 3.4 Retire Vercel

- [ ] Leave the Vercel deployment up for ~30 days as a fallback.
- [ ] Update the URLs table in `README.md`.
- [ ] After the grace period, delete the Vercel project.

**Rollback at any point:** set `ASSET_BASE` back to the Vercel URL, run
`pnpm compile-stylesheet-framer`, re-paste and publish. This is why Vercel stays up.

---

## Notes

- After Phase 3 the client owns the account, the domain and the token, and has full access
  to this repo. If the engagement ends, the assets keep serving with no involvement from
  you, and they can rotate the token themselves.
- Cloudflare's free-tier terms discourage serving significant non-HTML/video content. The
  two background videos are ~1.5MB looping files rather than streaming, which is fine in
  practice, but it is the one thing that could draw attention. If it ever matters, leave
  the video on a separate host — it is referenced through the same `asset()` helper.
- Things Vercel did that Cloudflare does not: image optimization (unused —
  `images: { unoptimized: true }`, and `build-assets.sh` does it better) and Speed
  Insights. Nothing load-bearing for a Framer port source.
