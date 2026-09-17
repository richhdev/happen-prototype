// Stands in for the `framer` package, which only exists inside Framer.
//
// Ribbons.tsx, VideoBackground.tsx and Work.tsx import RenderTarget from it to
// ask whether they are drawing on the Framer canvas, where document.body is the
// editor chrome and a fixed full-screen portal would cover the whole UI. In this
// app there is no canvas, so current() answers preview and every one of those
// guards takes the published-page branch — which is the branch we want to look
// at on /framer/.
//
// Aliased onto the bare specifier "framer" in next.config.mjs, so the files in
// framer/ stay byte-for-byte what gets pasted into Framer.
export const RenderTarget = {
  canvas: "CANVAS",
  export: "EXPORT",
  thumbnail: "THUMBNAIL",
  preview: "PREVIEW",
  current: () => "PREVIEW",
};

// EventCard.tsx imports these two to put its content on the Framer properties
// panel. Outside Framer the panel does not exist, so registering controls is a
// no-op and ControlType only has to name the types that file asks for — the
// values are opaque to everything but Framer's editor.
export const addPropertyControls = () => {};

export const ControlType = {
  Boolean: "boolean",
  Number: "number",
  String: "string",
  Enum: "enum",
  Color: "color",
  Image: "image",
  ResponsiveImage: "responsiveimage",
  File: "file",
  Link: "link",
  Object: "object",
  Array: "array",
  ComponentInstance: "componentinstance",
};
