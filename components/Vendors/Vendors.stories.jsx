import Vendors, { VendorsClosed } from "./Vendors";

export default {
  title: "Sections/Vendors",
  component: Vendors,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Closed = {
  render: () => <VendorsClosed />,
};

export const Open = {};
