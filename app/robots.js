import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Emitted as a static /robots.txt by `output: export`.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
