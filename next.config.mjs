/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.*"],

  // public/assets is the asset host for the Framer site, so these are fetched
  // cross-origin by every visitor rather than by this app. Next's default for
  // public/ is max-age=0, must-revalidate, which makes a browser re-check all
  // 30 marks in the Trusted By marquee on every page load. They are stable
  // files, so a day in the browser with a week of background revalidation is
  // both faster and still lets a replaced image roll out on its own.
  async headers() {
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
