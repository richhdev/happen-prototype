// Two fixed card slots rather than an array. Framer's on-page editor only lists
// simple controls, so an Array control never appears there, and a third card
// breaks the row anyway. Read as the parameter defaults in Hosts.jsx and as
// `defaultValue` on the controls in framer/extra/Hosts.tsx.
//
// A slot with an empty title is not rendered.
export const DEFAULTS = {
  heading: "Want in?",
  body: "We’re always looking for well-connected individuals and magnetic group leaders – social, influential, and the life of the party.",
  card1Title: "Hosts & Promoters",
  card1Description: "Turn your network into a side hustle.",
  card1Cta: "Join the team",
  card1Link: "https://happengroup.fillout.com/t/hMmqKzd35Gus",
  card2Title: "Casual Event Workers",
  card2Description: "Pick up casual work at Australia's biggest events.",
  card2Cta: "Register",
  card2Link: "https://happengroup.fillout.com/casual_staff_eoi_summer_26_27",
};
