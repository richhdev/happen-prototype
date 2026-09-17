import About from "./About";
import { StatCounter } from "./StatCounter";

export default {
  title: "Sections/About",
  component: About,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Default = {};

export const Counter = {
  name: "Stat Counter",
  args: { value: 10, suffix: "+", duration: 1.8 },
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ fontSize: 96, fontWeight: 800 }}>
      <StatCounter {...args} />
    </div>
  ),
};
