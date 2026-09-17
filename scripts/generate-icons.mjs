// Builds the site icons and share image from the Figma exports in
// source-assets/site-icons, so a design change is re-exported and re-run.
//
//   node scripts/generate-icons.mjs
//
// Chromium (already a dev dependency for the screenshot script) rasterises the
// favicon SVGs, so there is no ImageMagick / librsvg to install. Outputs land on
// Next's App Router file conventions, which `output: 'export'` honours:
//
//   app/icon.png              browser tab / bookmarks   (favicon-dark.svg at 512)
//   app/favicon.ico           legacy + crawlers         (favicon-dark.svg at 16/32/48)
//   app/apple-icon.png        iOS home screen           (copied)
//   app/opengraph-image.png   Facebook, LinkedIn, Slack (copied)
//   app/twitter-image.png     X/Twitter                 (copied)
//
// Framer takes a light and a dark favicon as 64px PNG uploads in Site Settings:
//
//   framer/favicon-light.png
//   framer/favicon-dark.png

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "source-assets/site-icons");
const out = path.join(root, "app");

const iconPage = (name) => {
  const svg = fs
    .readFileSync(path.join(src, `${name}.svg`), "utf8")
    .replace(/ width="\d+" height="\d+"/, "")
    .replace("<svg", '<svg style="width:100%;height:100%;display:block"');
  return `<body style="margin:0;width:100vw;height:100vh">${svg}</body>`;
};

// ICO entries here are BMP DIBs rather than embedded PNGs: some decoders —
// Turbopack's included — reject a PNG-in-ICO without an alpha channel, and a
// DIB carries its own 32bpp BGRA whatever the screenshot was encoded as.
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

async function shot(name, size, file) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(iconPage(name));
  const buf = await page.screenshot({ path: file ?? undefined, omitBackground: true });
  await page.close();
  return buf;
}

await shot("favicon-dark", 512, path.join(out, "icon.png"));
await shot("favicon-light", 64, path.join(root, "framer/favicon-light.png"));
await shot("favicon-dark", 64, path.join(root, "framer/favicon-dark.png"));
fs.copyFileSync(path.join(src, "apple-icon.png"), path.join(out, "apple-icon.png"));
for (const f of ["opengraph-image.png", "twitter-image.png"]) {
  fs.copyFileSync(path.join(src, "opengraph-image.png"), path.join(out, f));
}

// Round-trip each rendering through a canvas to get at its pixels, which is
// the only way to reach raw RGBA without pulling in an image library.
const reader = await browser.newPage();
await reader.setContent("<body></body>");

const icons = [];
for (const size of [16, 32, 48]) {
  const png = await shot("favicon-dark", size, null);
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
  "app/icon.png",
  "app/apple-icon.png",
  "app/favicon.ico",
  "app/opengraph-image.png",
  "app/twitter-image.png",
  "framer/favicon-light.png",
  "framer/favicon-dark.png",
]) {
  const { size } = fs.statSync(path.join(root, f));
  console.log(`${f}  ${(size / 1024).toFixed(1)} KB`);
}
