import { SITE_URL } from "@/lib/site";

// `output: export` needs the route resolved at build time rather than per
// request — `new Date()` below would otherwise make it dynamic.
export const dynamic = "force-static";

// One page, so one entry. `lastModified` is stamped at build time — a redeploy
// is the only thing that can change what's on it.
export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
