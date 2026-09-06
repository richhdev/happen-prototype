import { SITE_URL } from "@/lib/site";

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
