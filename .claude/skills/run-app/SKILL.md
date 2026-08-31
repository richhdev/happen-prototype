---
name: run-app
description: Launch and visually check this Next.js site — start the dev server and capture screenshots at desktop/mobile, including states behind a click like the mobile menu. Use when asked to run, start, preview, or screenshot the app, or to confirm a CSS/layout change actually works in the browser.
---

# Running and screenshotting happen-prototype

## 1. Is the server already up?

The dev server is usually already running — the user keeps it open in Chrome. Check before starting another:

```bash
curl -sf http://localhost:3000 >/dev/null && echo UP || echo DOWN
```

If DOWN:

```bash
(npm run dev > /tmp/happen-dev.log 2>&1 &)
for i in $(seq 1 40); do curl -sf http://localhost:3000 >/dev/null && echo READY && break; sleep 1; done
```

Don't restart a server that's already up — it costs ~10s and interrupts the user's own browser session. To stop one you started: `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`.

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
- **Node resolves modules from the script's own location**, not cwd — a Playwright script written into a scratchpad dir can't find `playwright`. Another reason to use `scripts/screenshot.mjs`, which lives in the repo.
