// Static export config — works on Vercel AND GitHub Pages.
//
//  • Vercel / custom domain at the root: leave NEXT_PUBLIC_BASE_PATH unset.
//  • GitHub Pages project site (username.github.io/REPO): build with
//        NEXT_PUBLIC_BASE_PATH=/REPO pnpm build
//    so every asset is served from the /REPO/ sub-path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // emits a fully static site into ./out
  images: { unoptimized: true }, // required for `output: export`
  basePath: basePath || undefined,
  trailingSlash: true,         // /path/ -> /path/index.html, friendlier for static hosts
  eslint: { ignoreDuringBuilds: true }, // prototype export — don't fail build on lint nits
};

export default nextConfig;
