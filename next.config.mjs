import { fileURLToPath } from "node:url";

// The `framer` package only exists inside Framer, and three files in framer/
// import RenderTarget from it. Rather than rewrite those imports — the files
// have to stay byte-identical to what is pasted into Framer — the bare
// specifier is aliased onto a local stand-in. Only /framer/ pulls
// this in; the real site never imports anything from framer/.
const FRAMER_SHIM = fileURLToPath(
  new URL("./lib/framer-render-target.js", import.meta.url),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.*"],

  // dev runs on turbopack, build runs on webpack, so the alias is set twice.
  turbopack: { resolveAlias: { framer: "./lib/framer-render-target.js" } },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, framer: FRAMER_SHIM };
    return config;
  },

  // Storybook is built into public/storybook
  // Lighthouse is built into public/lighthouse
  async rewrites() {
    return [
      { source: "/storybook", destination: "/storybook/index.html" },
      { source: "/lighthouse", destination: "/lighthouse/index.html" },
      {
        source: "/lighthouse/mobile",
        destination: "/lighthouse/mobile/index.html",
      },
      {
        source: "/lighthouse/desktop",
        destination: "/lighthouse/desktop/index.html",
      },
    ];
  },

  // public/assets is the asset host for the Framer site, so these are fetched
  // cross-origin by every visitor rather than by this app. Next's default for
  // public/ is max-age=0, must-revalidate, which makes a browser re-check all
  // 30 marks in the Trusted By marquee on every page load. They are stable
  // files, so a day in the browser with a week of background revalidation is
  // both faster and still lets a replaced image roll out on its own.
  async headers() {
    // Next applies these under `next dev` too, where a re-exported asset keeps
    // its name and would sit stale in the browser for a day. Dev keeps Next's
    // revalidate-every-time default instead.
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
