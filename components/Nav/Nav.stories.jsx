import { userEvent, within } from "storybook/test";
import Nav, { NavPlaceholder } from "./Nav";

export default {
  title: "Sections/Nav",
  component: Nav,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  render: () => (
    <div style={{ height: "200vh" }}>
      <Nav />
      <NavPlaceholder />
    </div>
  ),
};

export const Desktop = {};

export const Mobile = {
  globals: { viewport: { value: "mobile2" } },
};

export const MobileMenuOpen = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
  },
};
