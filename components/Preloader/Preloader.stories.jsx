import { asset } from "@/lib/data";
import PreloaderOverlay from "./PreloaderOverlay";

// Preloader itself reads the SVG with node:fs at build time, so the story
// fetches the same file and renders the client overlay with it.
export default {
  title: "Sections/Preloader",
  component: PreloaderOverlay,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  loaders: [
    async () => ({
      logoMarkup: await (await fetch(asset("/assets/logo-draw.svg"))).text(),
    }),
  ],
};

export const Default = {
  render: (_, { loaded }) => (
    <PreloaderOverlay logoMarkup={loaded.logoMarkup} />
  ),
};
