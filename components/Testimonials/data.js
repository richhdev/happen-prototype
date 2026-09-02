import { asset } from "@/lib/data";

// Each entry is one message in the phone's thread. They alternate sides
// automatically — index order is the only thing that decides which way a
// bubble faces, so adding or removing one re-flows the whole thread.
//
// The last two are placeholders standing in until the real quotes land.
export const TESTIMONIALS = [
  {
    name: "Jeff Moss",
    role: "Sound Event Group",
    quote:
      "Collaborating with the guys from Happen Group is a pleasure. Their understanding of what is required at a festival and knowledge of site infrastructure ensures a seamless exercise. They are prepared to roll up their sleeves to get the job done and have the finesse to design exciting and dynamic spaces.",
    avatar: asset("/assets/testimonial-avatar-jeff-moss.jpg"),
  },
  {
    name: "Jerry Poon",
    role: "Director, Let Them Eat Cake",
    quote:
      "Working with The Happen Group for artist liaison, logistics, and artist services at the LTEC Festival was an absolute pleasure from start to finish. Their team consistently went above and beyond, anticipating needs before we even had to ask and thinking outside the box to solve challenges quickly and creatively.",
    avatar: asset("/assets/testimonial-avatar-jerry-poon.jpg"),
  },
  {
    name: "Placeholder Name",
    role: "Placeholder Role, Placeholder Company",
    quote:
      "Placeholder testimonial. The crew handled load-in, artist transfers and the back-of-house build without a single thing landing on our desk. Everything ran to the minute and the site looked better than the renders.",
    avatar: asset("/assets/testimonial-avatar-jeff-moss.jpg"),
  },
  {
    name: "Placeholder Name",
    role: "Placeholder Role, Placeholder Company",
    quote:
      "Placeholder testimonial. Three years running now and they still turn up early, stay late and fix the problems nobody else noticed. Easily the most reliable team we put on site.",
    avatar: asset("/assets/testimonial-avatar-jerry-poon.jpg"),
  },
];
