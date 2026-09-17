import { Badge } from "./Badge";

export default {
  title: "Primitives/Badge",
  component: Badge,
  args: {
    children: "Sold out",
    color: "charcoal",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["charcoal", "red", "orange"],
    },
  },
};

export const Charcoal = {
  globals: { backgrounds: { value: "cream" } },
};

export const Red = { args: { color: "red" } };

export const Orange = { args: { color: "orange" } };

export const AllColors = {
  globals: { backgrounds: { value: "grey" } },
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge {...args} color="charcoal" />
      <Badge {...args} color="red" />
      <Badge {...args} color="orange" />
    </div>
  ),
};
