import { asset } from "@/lib/data";

// Each entry is one message in the phone's thread. They alternate sides
// automatically — index order is the only thing that decides which way a
// bubble faces, so adding or removing one re-flows the whole thread.
//
// Every avatar points at the generic placeholder until the real headshots
// come through — swap each one out per person as they land.
export const TESTIMONIALS = [
  {
    name: "Jeff Moss",
    role: "Sound Event Group",
    quote:
      "Collaborating with the guys from Happen Group is a pleasure. Their understanding of what is required at a festival and knowledge of site infrastructure ensures a seamless exercise. They are prepared to roll up their sleeves to get the job done and have the finesse to design exciting and dynamic spaces.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Jacob Malmo",
    role: "Thick as Thieves",
    quote:
      "We've worked with the Happen team for years and it's been smooth sailing from day one. The care they put into their shows from sound, creative, artist experience and care is unmatched. Highly recommend.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Daniel Hildebrand",
    role: "Astral People",
    quote:
      "Working with Happen Group has been a seamless experience from day one. Their team has helped us build meaningful community engagement through a highly effective micro-influencer campaign, while their street team has played an important role in increasing awareness and driving ticket sales for our events. They're proactive, easy to work with, and consistently deliver with professionalism and care.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Miranda Nicol",
    role: "Untitled Group",
    quote:
      "We've loved working with Paris and Dana at Happen Group on the retail precinct at Beyond the Valley and Pitch Music & Arts. They come to every conversation prepared, stay on top of timelines, and make the whole process feel collaborative, which is exactly what you need in the lead-up to a major festival. We always feel like our vendor relationships are in good hands.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Mike Toner",
    role: "Thick as Thieves",
    quote:
      "I have been working with Happen Group for a number of years now, and everything from their communication, professionalism and attention to detail is top notch. They really know how to wear the hats of everyone from promoters, to punters, to site operators and everyone else, which results in a win-win for all working with them. Could not recommend highly enough.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Annie Tetzlaff",
    role: "Good Things Festival / Destroy All Lines",
    quote:
      "We absolutely love working with Happen Group. Macca, Paris and the team are incredibly easy to work with, communicate well and are super organised. No matter what gets thrown at them onsite, they're calm, adaptable and just get on with it with a smile and a laugh.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Jerry Poon",
    role: "Director, LTEC",
    quote:
      "Working with The Happen Group for artist liaison, logistics, and artist services at the LTEC Festival was an absolute pleasure from start to finish. Their team consistently went above and beyond, anticipating needs before we even had to ask and thinking outside the box to solve challenges quickly and creatively. Every aspect of artist care and logistics was handled with efficiency and professionalism, and they maintained an exceptionally high standard throughout the entire event. Their dedication and attention to detail made a real difference to our artists' experience, and we wouldn't hesitate to work with The Happen Group again.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
  {
    name: "Fil Palermo",
    role: "Director, Untitled Group",
    quote:
      "We have worked with the team at Happen Group for over 10 years now in a number of different roles. Whether we are contracting them to deliver an area of one of our festivals or working together on an event it is always a great experience.",
    avatar: asset("/assets/testimonial-avatar-placeholder.svg"),
  },
];
