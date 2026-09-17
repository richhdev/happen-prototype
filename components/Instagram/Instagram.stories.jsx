import Instagram from "./Instagram";
import { InstagramCard } from "./InstagramCard";
import { IG_TILES } from "./data";

export default {
  title: "Sections/Instagram",
  component: Instagram,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Default = {};

export const Card = {
  args: IG_TILES[0],
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ width: 280 }}>
      <InstagramCard {...args} />
    </div>
  ),
};
