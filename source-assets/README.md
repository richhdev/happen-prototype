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

Export flat rectangles. The cards clip their own corners with `border-radius`
and `overflow: hidden`, so a baked-in radius either doubles up or, on a
transparent export, lets the page show through.

Subdirectories are for organisation only; the encoder flattens them, so
basenames must be unique across the whole tree and must match what the component
asks for in `public/assets`.
