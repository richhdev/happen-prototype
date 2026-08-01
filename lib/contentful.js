// Contentful Content Delivery API (read-only).
// The CDA token only reads published content, so it's safe to ship in a static
// client bundle. Override any of these via .env.local (NEXT_PUBLIC_* so they're
// available in the browser) without touching code.
const SPACE = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE || "1hcl2x8teihq";
const TOKEN =
  process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN ||
  "gm-SMdl3z9gyQuTOwQiR7YoqBBRHc3DEMqMJInBWazE";
const ENV = process.env.NEXT_PUBLIC_CONTENTFUL_ENV || "master";

// Build an optimised image URL from a Contentful asset file url.
// Contentful returns protocol-relative urls (//images.ctfassets.net/...) and
// supports on-the-fly transforms via query params (Images API).
export function ctfImage(url, { w = 800, h = 600 } = {}) {
  if (!url) return "";
  const abs = url.startsWith("//") ? `https:${url}` : url;
  return `${abs}?w=${w}&h=${h}&fit=fill&f=top&fm=webp&q=75`;
}

// Fetch published events (soonest first), with their linked image asset resolved
// into a plain shape the component can render directly.
export async function fetchEvents() {
  const params = new URLSearchParams({
    access_token: TOKEN,
    content_type: "events",
    include: "1",
    order: "fields.date",
  });
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?${params}`,
    { cache: "no-store" }, // always read the latest so edits appear without a rebuild
  );
  if (!res.ok) throw new Error(`Contentful request failed (${res.status})`);
  const data = await res.json();

  const assets = new Map(
    (data.includes?.Asset || []).map((a) => [a.sys.id, a]),
  );

  // Map the CMS "Status" field values onto the tag keys the UI already styles.
  const STATUS_TO_TAG = {
    Upcoming: "upcoming",
    "On Sale": "onsale",
    "Sold Out": "soldout",
  };

  return (data.items || []).map((item) => {
    const f = item.fields;
    const asset = f.image ? assets.get(f.image.sys.id) : null;
    return {
      id: item.sys.id,
      title: f.title,
      description: f.description || "",
      date: f.date,
      url: f.ticketLink || "#",
      tag: STATUS_TO_TAG[f.status] || "upcoming",
      imgUrl: asset?.fields?.file?.url || "",
    };
  });
}
