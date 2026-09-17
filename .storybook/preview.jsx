import "../app/fonts.css";
import "../app/globals.css";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      options: {
        charcoal: { name: "Charcoal", value: "#111111" },
        grey: { name: "Grey 900", value: "#191919" },
        cream: { name: "Cream", value: "#ebe6de" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "charcoal" },
  },
  decorators: [
    (Story) => (
      <div style={{ color: "var(--color-cream)" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
