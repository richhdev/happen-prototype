#!/usr/bin/env bash
# Build public/assets from source-assets/. Every source shares its basename with
# what ships: PNG/JPG exports are encoded to WebP, and files already in a web
# format are copied. Re-running reproduces public/assets byte for byte.
#
#   ./scripts/build-assets.sh            build anything whose source is newer
#   ./scripts/build-assets.sh --force    rebuild everything
#
# Needs cwebp: brew install webp

set -euo pipefail
cd "$(dirname "$0")/.."

force=${1:-}

# q85 was ~1MB heavier across the photos for no visible gain; below q75 the
# halftone grain softens. -sharp_yuv stops black knit fringing against skin.
photo="-q 75 -m 6 -sharp_yuv -noalpha"
ribbon="-q 72 -alpha_q 80 -m 6 -sharp_yuv"

before_kb=$(du -sk public/assets | cut -f1)

for src in source-assets/*/*; do
  # Built into app/ by generate-icons.mjs instead.
  [[ "$src" == source-assets/site-icons/* ]] && continue

  file=$(basename "$src")
  name=${file%.*}

  case "$file" in
    # Shipped as exported. The two avatars are JPGs in the markup.
    *.svg | *.webp | testimonial-avatar-jeff-moss.jpg | testimonial-avatar-jerry-poon.jpg | testimonials-phone-frame.png)
      out="public/assets/$file"
      if [ "$force" = "--force" ] || [ ! -f "$out" ] || [ "$src" -nt "$out" ]; then
        cp "$src" "$out"
        echo "$file  copied"
      fi
      continue
      ;;
    *.png | *.jpg) ;;
    *) continue ;;
  esac

  mobile=""
  case "$(basename "$(dirname "$src")")" in
    # Nearly all alpha, so resolution sets the size, not quality. The largest
    # placement is ~1650px on the 2560 tile, and ~710px on phones.
    ribbons) opts="-resize 2000 0 $ribbon" mobile="-resize 1200 0 $ribbon" ;;
    # Flat type on transparency: lossy rings at the letter edges, and
    # near-lossless 40 came out smaller than both lossless and q85.
    client-logos) opts="-near_lossless 40 -z 9" ;;
    # 2x the 320px phone card; Work picks it with srcset.
    work) opts="$photo" mobile="-resize 640 0 $photo" ;;
    # 2x the 400px phone card; Services picks it with srcset.
    services) opts="$photo" mobile="-resize 800 0 $photo" ;;
    # 2x the 360px card. Event art comes from promoters at any size.
    events) opts="-resize 720 0 $photo" ;;
    *) opts="$photo" ;;
  esac

  out="public/assets/$name.webp"
  out_mobile="public/assets/$name-mobile.webp"

  # A set with a -mobile cut only counts as fresh once that cut exists too.
  if [ "$force" != "--force" ] && [ "$out" -nt "$src" ] && { [ -z "$mobile" ] || [ -f "$out_mobile" ]; }; then
    continue
  fi

  cwebp -quiet $opts "$src" -o "$out"
  [ -n "$mobile" ] && cwebp -quiet $mobile "$src" -o "$out_mobile"
  echo "$name  $(du -k "$src" | cut -f1)k -> $(du -k "$out" | cut -f1)k"
done

after_kb=$(du -sk public/assets | cut -f1)
echo "public/assets  ${before_kb}k -> ${after_kb}k  ($((after_kb - before_kb))k)"
