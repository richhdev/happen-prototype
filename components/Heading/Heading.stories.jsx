import { Heading1, Heading2, Heading3, Heading4 } from "./Heading";

export default {
  title: "Primitives/Heading",
  component: Heading2,
  args: {
    children: "What's Happening",
    animateTracking: false,
  },
  argTypes: {
    as: { control: "text" },
  },
};

export const H1 = { name: "H1", render: (args) => <Heading1 {...args} /> };
export const H2 = { name: "H2", render: (args) => <Heading2 {...args} /> };
export const H3 = { name: "H3", render: (args) => <Heading3 {...args} /> };

export const H3Sentence = {
  name: "H3 Sentence",
  args: { sentence: true },
  render: (args) => <Heading3 {...args} />,
};

export const H4 = {
  name: "H4",
  args: { animateTracking: undefined },
  render: (args) => <Heading4 {...args} />,
};

export const AllLevels = {
  render: ({ animateTracking, ...args }) => (
    <div style={{ display: "grid", gap: 24 }}>
      <Heading1 animateTracking={animateTracking} {...args} />
      <Heading2 animateTracking={animateTracking} {...args} />
      <Heading3 animateTracking={animateTracking} {...args} />
      <Heading3 sentence {...args} />
      <Heading4 {...args} />
    </div>
  ),
};
