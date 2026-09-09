/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.*"],
};

export default nextConfig;
