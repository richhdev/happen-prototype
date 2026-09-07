#!/usr/bin/env bash
# Encode the exports in source-assets/ into the WebPs that ship from
# public/assets/. Sources are the pristine Figma exports and are never served;
# this is the only thing that writes their shipped counterparts, so re-running
# it reproduces public/assets byte for byte.
#
#   ./scripts/build-assets.sh            encode anything whose source is newer
#   ./scripts/build-assets.sh --force    re-encode everything
#
# Needs cwebp: brew install webp

set -euo pipefail
cd "$(dirname "$0")/.."

# q85 rather than the ~q78 that looks identical on a still: these are photos on
# a 360px card at 2x, and the mesh and leather textures in them are exactly what
# a lower setting comes for. The whole quality step costs ~100KB across the
# section. `-sharp_yuv` is what keeps the black-knit-against-skin boundaries from
# fringing under chroma subsampling.
QUALITY=85

force=${1:-}
shopt -s nullglob

for src in source-assets/*/*.png source-assets/*/*.jpg; do
  name=$(basename "${src%.*}")
  out="public/assets/$name.webp"

  if [ "$force" != "--force" ] && [ -f "$out" ] && [ "$out" -nt "$src" ]; then
    continue
  fi

  if [ "$(dirname "$src")" = source-assets/client-logos ]; then
    # Logos are flat-colour type on transparency, which is the case lossy WebP
    # is worst at: the DCT rings along every letter edge, and `-noalpha` would
    # flatten the cutout to a black box. `-near_lossless` keeps the edges exact
    # while still letting the encoder collapse the large flat runs, and on this
    # set it comes out smaller than both plain lossless and q85 — the two things
    # you would otherwise reach for.
    cwebp -quiet -near_lossless 60 -z 9 "$src" -o "$out"
  else
    # `-noalpha` because none of this art is transparent — the cards clip their own
    # corners. It also drops the part-transparent edge rows Figma leaves on a frame
    # whose height wasn't a whole pixel.
    cwebp -quiet -q "$QUALITY" -m 6 -sharp_yuv -noalpha "$src" -o "$out"
  fi
  echo "$name  $(du -k "$src" | cut -f1)k -> $(du -k "$out" | cut -f1)k"
done

# The logos are vector and ship as-is: there is nothing for an encoder to do to
# an SVG that the source isn't already, so this pass is a copy, and exists only
# so public/assets stays reproducible from source-assets rather than holding
# files whose original lives nowhere.
for src in source-assets/*/*.svg; do
  out="public/assets/$(basename "$src")"

  if [ "$force" != "--force" ] && [ -f "$out" ] && [ "$out" -nt "$src" ]; then
    continue
  fi

  cp "$src" "$out"
  echo "$(basename "$src")  copied"
done
