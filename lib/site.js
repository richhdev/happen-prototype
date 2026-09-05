// The site's canonical origin. Open Graph and canonical tags have to be
// absolute — a crawler fetching the card from its own servers can't resolve
// "/opengraph-image.png" — so Next needs an origin to resolve them against.
// Change this one line if the site lands on a different host (www, staging).
export const SITE_URL = "https://happengroup.com.au";

export const SITE_NAME = "Happen Group";
