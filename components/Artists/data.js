import { asset } from "@/lib/data";

// `links` is ordered as the design lists them: the artist's music platform
// first, Instagram last. Sasha Fern has no music link, so the row is just the
// one entry rather than a placeholder.
export const ARTISTS = [
  {
    name: "Jämo",
    genre: "Electronic",
    img: asset("/assets/artist-jamo.jpg"),
    bio: "Australian DJ, producer and founder of Critical Feeling. Recognised for a euphoric, emotionally charged sound and electrifying live sets. An official Calvin Harris remix and standout appearances at Let Them Eat Cake, Beyond The Valley and A3 Festival.",
    links: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/5BatmKqX0n63qHXQTcKoPr",
      },
      { label: "Instagram", href: "https://instagram.com/jamo.wav" },
    ],
  },
  {
    name: "Laura King",
    genre: "Techno / Trance",
    img: asset("/assets/artist-laura-king-v2.jpg"),
    bio: "A leading force in Australia's contemporary techno/trance scene, bridging global trends and local flavour. High-energy sets blending hard dance, groove techno, hip hop vocals and psychedelic trance.",
    links: [
      { label: "Soundcloud", href: "https://soundcloud.com/laurakingofficial" },
      { label: "Instagram", href: "https://instagram.com/laura.king.music" },
    ],
  },
  {
    name: "Sasha Fern",
    genre: "House",
    img: asset("/assets/artist-sasha-fern.jpg"),
    bio: "Known for all things steezy, in style and in sound. A tasteful flow of Tech & Latino House, Jackin', Garage and bouncy rhythms. Has warmed up for Peggy Gou, Sharam Jey and Boys Noize.",
    links: [{ label: "Instagram", href: "https://instagram.com/sashafernn" }],
  },
  {
    name: "Vanna",
    genre: "Rave",
    img: asset("/assets/artist-vanna-v2.jpg"),
    bio: 'Melbourne-based, self-described "Naarm/Melbourne Rave Chic" and "bpm pusher." Has played Revolver Upstairs and venues in Paris and Dortmund.',
    links: [
      { label: "Soundcloud", href: "https://soundcloud.com/vannaspins" },
      { label: "Instagram", href: "https://instagram.com/vannaspins" },
    ],
  },
];
