/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: ["../components/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  // Dev serves public/ through Vite. The build lands in public/storybook and
  // is deployed alongside the site, which already serves /assets.
  viteFinal: (config, { configType }) =>
    configType === "PRODUCTION" ? { ...config, publicDir: false } : config,
};

export default config;
