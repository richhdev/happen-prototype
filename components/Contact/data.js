export const CONTACT_EMAIL = "hello@happengroup.com.au";

export const LINK_CARDS = [
  {
    title: "Retail vendors - Good Things 2026",
    description:
      "We're on the lookout for market stall holders to join us at the festival and help bring the space to life.",
    label: "Get your stall",
    href: "https://form.jotform.com/261311126413846",
  },
  {
    title: "Retail vendors - Beyond the Valley 2026",
    description:
      "We're on the lookout for market stall holders to join us at the festival and help bring the space to life.",
    label: "Get your stall",
    href: "https://form.jotform.com/261448233625861",
  },
  {
    title: "Work with us",
    description:
      "Register your interest to hear about casual work opportunities in the events industry",
    label: "Join the team",
    href: "https://happengroup.fillout.com/casual_staff_eoi_summer_26_27",
  },
  {
    title: "Promoter / Influencer Sign up",
    description: "If you know how to hype a party, we want you on the team",
    label: "Register",
    href: "https://happengroup.fillout.com/t/hMmqKzd35Gus",
  },
];

// Rendered as label + input pairs; `rows` marks the one multi-line field.
export const FORM_FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "message", label: "Message", rows: 3 },
];
