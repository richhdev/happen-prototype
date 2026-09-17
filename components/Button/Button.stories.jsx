import {
  Button,
  ButtonLarge,
  ButtonMedium,
  ButtonOutlineLarge,
  ButtonOutlineMedium,
} from "./Button";

export default {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Let's talk",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["charcoal", "cream", "white", "red", "orange"],
    },
    href: { control: "text" },
    onClick: { action: "click" },
  },
};

export const Large = { render: (args) => <ButtonLarge {...args} /> };
export const Medium = { render: (args) => <ButtonMedium {...args} /> };
export const OutlineLarge = {
  render: (args) => <ButtonOutlineLarge {...args} />,
};
export const OutlineMedium = {
  render: (args) => <ButtonOutlineMedium {...args} />,
};

export const AsLink = {
  args: { href: "#a-contact" },
  render: (args) => <ButtonLarge {...args} />,
};

export const AllVariants = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <ButtonLarge {...args} />
      <ButtonMedium {...args} />
      <ButtonOutlineLarge {...args} />
      <ButtonOutlineMedium {...args} />
    </div>
  ),
};
