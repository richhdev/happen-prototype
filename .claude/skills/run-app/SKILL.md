---
name: run-app
description: Launch and visually check this Next.js site — start the dev server and capture screenshots at desktop/mobile, including states behind a click like the mobile menu. Use when asked to run, start, preview, or screenshot the app, or to confirm a CSS/layout change actually works in the browser.
---

# Running and screenshotting happen-prototype

## 1. Is the server already up?

The dev server is almost always already running — the user keeps it open in Chrome on port 3000. Check both whether something is listening and what it actually returns:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

**A listener means the server is up — use it, whatever the status code.** Don't use `curl -sf` as the readiness test: `-f` fails on any status >= 400, so a page erroring for a moment reads as "down" and you start a redundant second server while the user watches a stale tab. If there's a listener but the status is 500, wait a few seconds and re-curl; it's usually mid-recompile.

Only if nothing is listening:

```bash
(npm run dev > /tmp/happen-dev.log 2>&1 &)
for i in $(seq 1 40); do curl -s -o /dev/null http://localhost:3000 && echo READY && break; sleep 1; done
```

Next picks a different port when 3000 is taken — read `/tmp/happen-dev.log` for the real one and pass it via `--url`. Needing that flag is a signal you started a server you didn't need. To stop one you started: `lsof -ti:3001 -sTCP:LISTEN | xargs kill`.

## 2. Screenshot with `scripts/screenshot.mjs`

Never hand-write a throwaway Playwright script. Use the committed one:

```bash
node scripts/screenshot.mjs                                            # desktop + mobile of /
node scripts/screenshot.mjs --path /work                               # a specific route
node scripts/screenshot.mjs --w 390 --click "[aria-label='Open menu']" --name menu-open
node scripts/screenshot.mjs --scroll 1000                              # past the hero
node scripts/screenshot.mjs --full                                     # whole page
```

It prints every path it writes, into `.screenshots/` (gitignored). Read those files — a change isn't verified until you've actually looked at the image.

Flags: `--url --path --w --h --scroll --click (repeatable) --wait <selector> --name --full`.

The Playwright MCP server is also configured (user scope). Prefer it for interactive poking at a live page — inspecting an element, trying states, following a bug. Prefer `screenshot.mjs` for "capture these known states and show me", which is most visual verification.

## Gotchas

- **`timeout` doesn't exist on macOS.** Poll with a `for` + `curl` loop instead, as above.
- **Never wait on `networkidle`.** Next's dev server holds an HMR websocket open, so it never settles. `screenshot.mjs` waits on `load`; use `--wait <selector>` when you need something specific.
- **Don't run `next build` to check a visual change.** This project sets no `distDir`, so `next build` and `next dev` share `.next/` — the build overwrites the directory the user's dev server is serving from and knocks it over mid-session. HMR on the running server already reflects your edit. Build only when a production build is itself the thing being verified.
- **Node resolves modules from the script's own location**, not cwd — a Playwright script written into a scratchpad dir can't find `playwright`. Another reason to use `scripts/screenshot.mjs`, which lives in the repo.
