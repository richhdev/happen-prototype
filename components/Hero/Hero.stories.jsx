import Hero from "./Hero";
import { TrustedBy } from "./TrustedBy";

export default {
  title: "Sections/Hero",
  component: Hero,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Default = {};

export const TrustedByMarquee = {
  name: "Trusted By",
  render: () => <TrustedBy />,
};
