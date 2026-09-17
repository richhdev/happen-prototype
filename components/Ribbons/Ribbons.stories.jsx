import Ribbons from "./Ribbons";

export default {
  title: "Layout/Ribbons",
  component: Ribbons,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Default = {
  render: () => (
    <div style={{ position: "relative", height: "400vh" }}>
      <Ribbons />
    </div>
  ),
};
