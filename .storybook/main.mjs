import { fileURLToPath } from "node:url";

const FRAMER_SHIM = fileURLToPath(
  new URL("../lib/framer-render-target.js", import.meta.url),
);

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: ["../components/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  // Dev serves public/ through Vite. The build lands in public/storybook and
  // is deployed alongside the site, which already serves /assets.
  //
  // The `framer` alias mirrors next.config.mjs. Components import RenderTarget
  // and addPropertyControls from it so the source and the ported copy can be
  // the same code; the package only exists inside Framer, so both builds point
  // the bare specifier at the local stand-in.
  viteFinal: (config, { configType }) => {
    const c = configType === "PRODUCTION" ? { ...config, publicDir: false } : config;
    c.resolve = { ...c.resolve, alias: { ...c.resolve?.alias, framer: FRAMER_SHIM } };
    return c;
  },
};

export default config;
