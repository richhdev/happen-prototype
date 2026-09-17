/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: ["../components/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};

export default config;
