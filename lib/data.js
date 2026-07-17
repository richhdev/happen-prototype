// All site content + the asset() helper.
// asset() prefixes NEXT_PUBLIC_BASE_PATH so the same paths work at the domain
// root (Vercel) or under a /repo sub-path (GitHub Pages).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p) => `${BASE}${p}`;

// Shared cubic-bezier easing used across every animation.
export const EASE = [0.16, 1, 0.3, 1];

export const NAV_LINKS = [
  { id: "a-services", label: "Services" },
  { id: "b-work", label: "Work" },
  { id: "b-artists", label: "Artists" },
  { id: "a-venues", label: "Venues" },
  { id: "a-about", label: "About" },
  { id: "a-whatson", label: "What's On" },
  { id: "a-traders", label: "Traders" },
];

export const SERVICES = [
  { meta: "Plan · Deliver · Manage · Operate", title: "Artist Services", desc: "End-to-end artist services and liaison for festivals and major events — from advancing and on-ground operations to individual artist care and everything in between." },
  { meta: "Plan · Stock · Host · Deliver", title: "Artist Hospitality", desc: "Dressing rooms, riders, and green rooms — set, stocked, and on-point. Full hospitality management from advance through to show day." },
  { meta: "Advance · Book · Map · Staff · Run · Report", title: "Artist BOH Management", desc: "Back-of-house zones, flows, and ops coordinated from load-in to pack-down. Tour logistics, advancing, riders, scheduling, comms, finance and settlements." },
  { meta: "Book · Negotiate · Contract · Confirm", title: "Artist Management", desc: "From offer and routing to contracts, deposits and lock-in. We book your flights, organise ground transfers, handle accounts and get you playing at Australia's biggest events." },
  { meta: "Advance · Book · Move · Track", title: "Artist Tour Logistics", desc: "Flights, hotels, ground transfers, visas, per diems. All in. All sorted. Always smiling." },
  { meta: "Program · Advance · Tour · Deliver", title: "Comedy & Podcast Tours", desc: "Venue sourcing, routing, budgeting, support act bookings, ticketing coordination, production planning, flights, accommodation, advancing, tour management, settlements and reporting across Australia and New Zealand." },
  { meta: "Source · Brief · Deploy · Deliver", title: "Event Staffing", desc: "The secret sauce behind events and festivals that run without a hitch — from front gate / box office, drivers, artist liaisons, stage managers and everything in between." },
  { meta: "Source · Curate · Build · Operate · Remit", title: "Market Villages", desc: "Drawing from a vast network of vendors across Australia. We handle the entire process — from applications through to show day — with a curated mix of retail and service offerings." },
  { meta: "Connect · Pair · Program · Deliver", title: "Venue Bookings", desc: "Matching the right space to the right crowd via deep industry relationships across the Australian music scene." },
  { meta: "Design · Curate · Build · Staff · Operate", title: "Wellness & Activations", desc: "Purpose-built spaces within festivals — from yoga and sound healing to breathwork, meditation, talks, speed dating and trivia. Custom infrastructure designed to suit your audience." },
  { meta: "Recruit · Activate · Track · Amplify", title: "Community Building", desc: "A modernised street team — hosts and promoters raising awareness & selling tickets directly to their networks, with digital tracking and seamless management." },
];

export const SVC_BGS = [
  asset("/assets/svc-bg-1.jpg"),
  asset("/assets/svc-bg-2.jpg"),
  asset("/assets/svc-bg-3.jpg"),
  asset("/assets/svc-bg-4.jpg"),
  asset("/assets/svc-bg-5.jpg"),
];

export const WORK = [
  { title: "Knotfest", tag: "BOH Management — Nationwide", logo: asset("/assets/client-knotfest.png"), logoH: 30, bg: asset("/assets/artist-jamo.jpg") },
  { title: "Good Things Festival", tag: "BOH Management — Nationwide", logo: asset("/assets/client-goodthings-v2.png"), logoH: 52, bg: asset("/assets/venue-brown-alley.webp") },
  { title: "Beyond The Valley", tag: "Front Market Villages", logo: asset("/assets/client-btv.svg"), logoH: 34, bg: asset("/assets/artist-laura-king.jpg") },
  { title: "A3 Festival", tag: "Role — to be supplied", logo: asset("/assets/client-a3.png"), logoH: 46, bg: asset("/assets/event-chapter.png") },
  { title: "Let Them Eat Cake", tag: "Role — to be supplied", logo: asset("/assets/client-let-them-eat-cake.svg"), logoH: 34, bg: asset("/assets/artist-sasha-fern.jpg") },
  { title: "Promiseland", tag: "Role — to be supplied", logo: asset("/assets/client-promiseland.png"), logoH: 96, bg: asset("/assets/venue-bourke-st-courtyard.png") },
  { title: "Eden Festival (NZ)", tag: "Role — to be supplied", logo: asset("/assets/client-eden-fest.png"), logoH: 104, bg: asset("/assets/artist-vanna.jpg") },
  { title: "Souled Out", tag: "Role — to be supplied", logo: asset("/assets/client-souled-out-v2.png"), logoH: 76, bg: asset("/assets/event-overdrive.png") },
];

export const ARTISTS = [
  { genre: "Electronic", name: "JÄMO", img: asset("/assets/artist-jamo.jpg"), desc: "Australian DJ, producer and founder of Critical Feeling — recognised for a euphoric, emotionally charged sound and electrifying live sets. An official Calvin Harris remix and standout appearances at Let Them Eat Cake, Beyond The Valley and A3 Festival.", handle: "@jamo.wav · Spotify" },
  { genre: "Techno / Trance", name: "Laura King", img: asset("/assets/artist-laura-king.jpg"), desc: "A leading force in Australia's contemporary techno/trance scene, bridging global trends and local flavour. High-energy sets blending hard dance, groove techno, hip hop vocals and psychedelic trance.", handle: "@laura.king.music · Spotify" },
  { genre: "House", name: "Sasha Fern", img: asset("/assets/artist-sasha-fern.jpg"), desc: "Known for all things steezy, in style and in sound. A tasteful flow of Tech & Latino House, Jackin', Garage and bouncy rhythms. Has warmed up for Peggy Gou, Sharam Jey and Boys Noize.", handle: "@sashafernn · Spotify" },
  { genre: "Rave", name: "Vanna", img: asset("/assets/artist-vanna.jpg"), desc: 'Melbourne-based, self-described "Naarm/Melbourne Rave Chic" and "bpm pusher." Has played Revolver Upstairs and venues in Paris and Dortmund.', handle: "@vannaspins · SoundCloud" },
];

export const VENUES = [
  { meta: "629 Bourke St, CBD", name: "Bourke Street Courtyard", img: asset("/assets/venue-bourke-st-courtyard.png"), desc: "A heritage bluestone courtyard in the heart of the CBD. Industrial, open-air, and built for all-day and all-night events.", capacity: "Capacity 800" },
  { meta: "Corner of King & Lonsdale St, CBD", name: "Brown Alley", img: asset("/assets/venue-brown-alley.webp"), desc: "Melbourne's most iconic underground club — four rooms, world-class sound, and a 24-hour licence inside a heritage building on King Street.", capacity: "Capacity 1200" },
];

export const TRUSTED = [
  { name: "Beyond The Valley", src: asset("/assets/client-btv.svg"), h: 26 },
  { name: "Live Nation", src: asset("/assets/client-live-nation.png"), h: 26 },
  { name: "Novel", src: asset("/assets/client-novel.png"), h: 22 },
  { name: "Happy Hour", src: asset("/assets/client-happy-hour.png"), h: 30 },
  { name: "Dangerous Goods", src: asset("/assets/client-dg.png"), h: 24 },
  { name: "A3", src: asset("/assets/client-a3.png"), h: 22 },
  { name: "Astral People", src: asset("/assets/client-astral-people.svg"), h: 40 },
  { name: "Strawberry Fields", src: asset("/assets/client-strawberry-fields.png"), h: 40 },
  { name: "Pitch", src: asset("/assets/client-pitch.png"), h: 22 },
  { name: "Destroy All Lines", src: asset("/assets/client-destroy-all-lines.svg"), h: 26 },
];

export const SUPPLIERS = [
  { name: "Hertz", src: asset("/assets/supplier-hertz-dark.png"), h: 29 },
  { name: "Avis", src: asset("/assets/supplier-avis-dark.png"), h: 27 },
  { name: "Network Transfers", src: asset("/assets/supplier-network-transfers-dark.png"), h: 26 },
  { name: "Kmart", src: asset("/assets/supplier-kmart-dark.png"), h: 21 },
  { name: "Coles", src: asset("/assets/supplier-coles-dark.png"), h: 27 },
  { name: "Dan Murphy's", src: asset("/assets/supplier-dan-murphys-dark.png"), h: 25 },
  { name: "Bunnings", src: asset("/assets/supplier-bunnings-dark.png"), h: 28 },
  { name: "Valiant", src: asset("/assets/supplier-valiant-dark.png"), h: 21 },
  { name: "Gig", src: asset("/assets/supplier-gig-dark.png"), h: 30 },
  { name: "Social", src: asset("/assets/supplier-social-dark.png"), h: 25 },
];

export const TESTIMONIALS = [
  { quote: "“Collaborating with the guys from Happen Group is a pleasure. Their understanding of what is required at a festival and knowledge of site infrastructure ensures a seamless exercise. They are prepared to roll up their sleeves to get the job done and have the finesse to design exciting and dynamic spaces.”", src: "Jeff Moss · Sound Event Group" },
  { quote: "“We’ve worked with the Happen team for years and it’s been smooth sailing from day one. The care they put into their shows from sound, creative, artist experience and care is unmatched. Highly recommend.”", src: "Jacob Malmo · Thick as Thieves" },
  { quote: "“Working with Happen Group has been a seamless experience from day one. Their team has helped us build meaningful community engagement through a highly effective micro-influencer campaign, while their street team has played an important role in increasing awareness and driving ticket sales for our events. They’re proactive, easy to work with, and consistently deliver with professionalism and care.”", src: "Daniel Hildebrand · Astral People" },
  { quote: "“We’ve loved working with Paris and Dana at Happen Group on the retail precinct at Beyond the Valley and Pitch Music & Arts. They come to every conversation prepared, stay on top of timelines, and make the whole process feel collaborative, which is exactly what you need in the lead-up to a major festival. We always feel like our vendor relationships are in good hands.”", src: "Miranda Nicol · Untitled Group" },
  { quote: "“I have been working with Happen Group for a number of years now, and everything from their communication, professionalism and attention to detail is top notch. They really know how to wear the hats of everyone from promoters, to punters, to site operators and everyone else, which results in a win-win for all working with them. Could not recommend highly enough.”", src: "Mike Toner · Thick as Thieves" },
  { quote: "“We absolutely love working with Happen Group. Macca, Paris and the team are incredibly easy to work with, communicate well and are super organised. No matter what gets thrown at them onsite, they’re calm, adaptable and just get on with it with a smile and a laugh.”", src: "Annie Tetzlaff · Good Things Festival / Destroy All Lines" },
];

export const EVENTS = [
  { tag: "upcoming", title: "Chapter", when: "Date · Artists", img: asset("/assets/event-chapter.png") },
  { tag: "onsale", title: "Party Girl", when: "Date · Artists", img: asset("/assets/event-partygirl.png") },
  { tag: "soldout", title: "Overdrive", when: "Date · Artists", img: asset("/assets/event-overdrive.png") },
];

export const IG_TILES = [
  asset("/uploads/insta1.jpg"),
  asset("/uploads/insta2.png"),
  asset("/uploads/insta3.jpg"),
  asset("/uploads/insta4.jpg"),
  asset("/uploads/insta5.png"),
  asset("/uploads/insta6.jpg"),
];
