# source-assets

Pristine Figma exports. Nothing here is served — it sits outside `public/` so
Next never sees it — and nothing here should be edited by hand. It is the input
to `scripts/build-assets.sh`, which encodes it into the WebPs that ship from
`public/assets/`.

    ./scripts/build-assets.sh            encode anything whose source is newer
    ./scripts/build-assets.sh --force    re-encode everything

Keeping the exports means the shipped art can be re-encoded from a lossless
original rather than from an already-lossy file, whatever the encoder settings
turn out to want later — which matters most when the Next image optimiser goes
on, since it will be re-encoding whatever `public/assets` holds.

## Exporting

Export at **2x the CSS box the art renders in**, not 2x the Figma frame — the
frame is the design size, and the two only coincide by accident. The event cards
are 360x457, so their art is 720x914.

The work cards are the one place the two do coincide: the card is a 420px square
(`--card-active`) and so is the Figma node, so their art is 840x840. Keep it
square. Because it matches the card's aspect exactly, `object-fit: cover` crops
nothing, which is what lets the framing in the design survive to the page — a
non-square export would silently re-crop and need an `objectPosition` in
`components/Work/data.js` to put it back.

Export flat rectangles. The cards clip their own corners with `border-radius`
and `overflow: hidden`, so a baked-in radius either doubles up or, on a
transparent export, lets the page show through.

Subdirectories are for organisation only; the encoder flattens them, so
basenames must be unique across the whole tree and must match what the component
asks for in `public/assets`.

## Logos

Client logos are vector wherever the client has one, and the SVG pass copies
them straight through — an SVG is already its own best encoding. Export them on
a transparent ground; several of these marks (S.A.S.H, Astral People) are a
filled block with the lettering knocked out of it, which is the design and not a
stray background.

The raster-only logos encode with `-near_lossless` rather than the photo
settings. Flat-colour type on transparency is the case lossy WebP is worst at —
it rings along every letter edge — and on this set near-lossless also came out
smaller than both plain lossless and q85, so there is nothing to trade off.

**Watch the padding.** These were exported into a fixed 560px-wide frame, so
each logo sits centred in however much transparent margin its shape leaves over,
and `object-fit: contain` scales to that frame, not to the ink. That makes the
`logoWidth`/`logoHeight` in `components/Work/data.js` and the `h` in
`TrustedBy.jsx` specific to one export's padding: re-export the same mark with
different margins and it silently changes size on the page. The numbers there
are tuned so the *ink* lands at the size the design called for. Exporting each
mark trimmed to its own bounds would make them stable — until then, re-check the
two files against a before/after screenshot whenever a logo is replaced.
