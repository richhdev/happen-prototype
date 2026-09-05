// Generates every icon and share image from the artwork in public/assets, so a
// logo change is re-run rather than re-drawn. The share card carries the whole
// mark; the icons carry logo-h.svg, the isolated "h", because the full mark's
// thin script is unreadable in a 16px tab.
//
//   node scripts/generate-icons.mjs
//
// Chromium (already a dev dependency for the screenshot script) does the
// rendering, so there is no ImageMagick / librsvg to install. Outputs land on
// Next's App Router file conventions, which `output: 'export'` honours:
//
//   app/icon.png              browser tab / bookmarks
//   app/apple-icon.png        iOS home screen
//   app/favicon.ico           legacy + search-engine crawlers
//   app/opengraph-image.png   Facebook, LinkedIn, Slack, iMessage
//   app/twitter-image.png     X/Twitter (same art, separate convention)

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "app");

const RED = "#ca0013";
const CREAM = "#ebe6de";
const CHARCOAL = "#111111";

// The mark is recoloured through `currentColor` rather than by editing the
// file, so the export stays a straight copy of what's in Figma.
const logo = fs
  .readFileSync(path.join(root, "public/assets/logo.svg"), "utf8")
  .replace(/fill="#CA0013"/gi, 'fill="currentColor"');

const mark = (color, width) =>
  `<div style="width:${width};color:${color};display:flex">
     ${logo.replace("<svg", '<svg style="width:100%;height:auto"')}
   </div>`;

// The "h" alone, cropped to a square that sits on the glyph's bottom and sides
// and lets the ascender run off the top edge. Trimming the ascender is what
// buys the legibility: at full height the glyph is 61x110, so fitting it into a
// square tile would shrink everything else to nothing. The cut has to bleed off
// the edge — a flat stroke end floating mid-tile reads as a rendering fault.
const H_BOX = { x: 10, y: 60, w: 60.75, h: 109.5 }; // glyph bounds in logo-h.svg
const H_PAD = 10;
const H_SIZE = H_BOX.w + H_PAD * 2;
const H_VIEWBOX = [
  H_BOX.x - H_PAD,
  H_BOX.y + H_BOX.h + H_PAD - H_SIZE, // anchor the bottom, crop off the top
  H_SIZE,
  H_SIZE,
].join(" ");

// An <svg> clips to its own viewport, so re-aiming the viewBox is all the crop
// takes — no second clip path.
const glyph = fs
  .readFileSync(path.join(root, "public/assets/logo-h.svg"), "utf8")
  .replace(/fill="#CA0013"/i, 'fill="currentColor"')
  .replace(/viewBox="[^"]*"/, `viewBox="${H_VIEWBOX}"`)
  .replace("<svg", '<svg style="width:100%;height:100%;display:block"');

// Cream-on-red, not the other way round: at 16px a solid tile holds its shape
// while the mark's thin script on a light ground washes out to nothing.
const iconPage = `<body style="margin:0">
  <div style="width:100vw;height:100vh;background:${RED};color:${CREAM}">
    ${glyph}
  </div>
</body>`;

const sharePage = `<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
</head>
<body style="margin:0;background:${CHARCOAL}">
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:76px 84px;
              display:flex;flex-direction:column;justify-content:space-between;
              font-family:Inter,-apple-system,'Helvetica Neue',sans-serif;
              color:${CREAM};overflow:hidden">
    ${mark(RED, "94px")}
    <div>
      <h1 style="margin:0;font-size:82px;line-height:1.02;font-weight:700;
                 text-transform:uppercase;letter-spacing:-.035em;max-width:17ch">Behind every event, is a team making it Happen</h1>
      <p style="margin:32px 0 0;font-size:26px;line-height:1.4;font-weight:400;
                color:${CREAM};opacity:.68;max-width:34ch">A Melbourne events agency, built on 10+ years of doing the work.</p>
    </div>
  </div>
</body>`;

// ICO entries here are BMP DIBs rather than embedded PNGs: Chromium only ever
// writes an opaque screenshot as RGB, and the decoders that read this file —
// Turbopack's included — reject a PNG-in-ICO that has no alpha channel. A DIB
// carries its own 32bpp BGRA, so there is nothing to re-encode.
function buildIco(icons) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(icons.length, 4);

  const images = icons.map(({ size, rgba }) => {
    const dib = Buffer.alloc(40);
    dib.writeUInt32LE(40, 0); // header size
    dib.writeInt32LE(size, 4); // width
    dib.writeInt32LE(size * 2, 8); // height counts the AND mask too
    dib.writeUInt16LE(1, 12); // colour planes
    dib.writeUInt16LE(32, 14); // bits per pixel
    dib.writeUInt32LE(0, 16); // BI_RGB, uncompressed

    // Rows run bottom-up, and each pixel is BGRA rather than RGBA.
    const xor = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const src = (y * size + x) * 4;
        const dst = ((size - 1 - y) * size + x) * 4;
        xor[dst] = rgba[src + 2];
        xor[dst + 1] = rgba[src + 1];
        xor[dst + 2] = rgba[src];
        xor[dst + 3] = rgba[src + 3];
      }
    }

    // 1bpp transparency mask, rows padded to 4 bytes. The alpha above already
    // says what is transparent, so every bit stays 0 (opaque).
    const and = Buffer.alloc(Math.ceil(size / 32) * 4 * size);

    return { size, data: Buffer.concat([dib, xor, and]) };
  });

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const browser = await chromium.launch();

async function shot(html, width, height, file) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  // Inter is the site's face; if it isn't cached locally the stack falls back
  // to the system sans rather than blocking the render.
  await page.waitForLoadState("networkidle").catch(() => {});
  const buf = await page.screenshot({ path: file ?? undefined });
  await page.close();
  return buf;
}

await shot(iconPage, 512, 512, path.join(out, "icon.png"));
await shot(iconPage, 180, 180, path.join(out, "apple-icon.png"));
await shot(sharePage, 1200, 630, path.join(out, "opengraph-image.png"));
fs.copyFileSync(
  path.join(out, "opengraph-image.png"),
  path.join(out, "twitter-image.png"),
);

// Round-trip each rendering through a canvas to get at its pixels, which is
// the only way to reach raw RGBA without pulling in an image library.
const reader = await browser.newPage();
await reader.setContent("<body></body>");

const icons = [];
for (const size of [16, 32, 48]) {
  const png = await shot(iconPage, size, size, null);
  const rgba = await reader.evaluate(
    async ({ url, size }) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      return Array.from(ctx.getImageData(0, 0, size, size).data);
    },
    { url: `data:image/png;base64,${png.toString("base64")}`, size },
  );
  icons.push({ size, rgba });
}
await reader.close();

fs.writeFileSync(path.join(out, "favicon.ico"), buildIco(icons));

await browser.close();

for (const f of [
  "icon.png",
  "apple-icon.png",
  "favicon.ico",
  "opengraph-image.png",
  "twitter-image.png",
]) {
  const { size } = fs.statSync(path.join(out, f));
  console.log(`app/${f}  ${(size / 1024).toFixed(1)} KB`);
}
