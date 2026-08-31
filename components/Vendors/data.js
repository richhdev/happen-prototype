import { asset } from "@/lib/data";

// The two festivals currently taking retail-vendor applications. `logoHeight` /
// `logoHeightMd` come straight from the design — each logo is scaled by its own
// pair, not one shared size, so the wordmarks keep their drawn proportions.
export const VENDOR_EVENTS = [
  {
    name: "Good Things Festival",
    img: asset("/assets/market-stall-good-things.png"),
    logo: asset("/assets/client-goodthings-v2.png"),
    logoHeight: 38,
    logoHeightMd: 47,
    cta: "Get your stall",
    link: "https://form.jotform.com/261311126413846",
  },
  {
    name: "Beyond The Valley",
    img: asset("/assets/market-stall-btv-precinct.jpg"),
    logo: asset("/assets/client-btv.svg"),
    logoHeight: 21,
    logoHeightMd: 32,
    cta: "Get your stall",
    link: "https://form.jotform.com/261448233625861",
  },
];
