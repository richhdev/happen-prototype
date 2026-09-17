import {
  BadgeText,
  ButtonTextLarge,
  ButtonTextMedium,
  TextLarge,
  TextMedium,
  TextOverline,
  TextSmall,
  TextXLarge,
  TextXXLarge,
} from "./Text";

const STYLES = {
  TextXXLarge,
  TextXLarge,
  TextLarge,
  TextMedium,
  TextSmall,
  TextOverline,
  ButtonTextLarge,
  ButtonTextMedium,
  BadgeText,
};

export default {
  title: "Primitives/Text",
  component: TextMedium,
  args: {
    children: "Behind every event is a team making it Happen.",
  },
  argTypes: {
    as: { control: "text" },
  },
};

const story = (Component) => ({
  render: (args) => <Component {...args} />,
});

export const XXLarge = story(TextXXLarge);
export const XLarge = story(TextXLarge);
export const Large = story(TextLarge);
export const Medium = story(TextMedium);
export const Small = story(TextSmall);
export const Overline = story(TextOverline);
export const ButtonLarge = story(ButtonTextLarge);
export const ButtonMedium = story(ButtonTextMedium);
export const Badge = story(BadgeText);

export const AllStyles = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {Object.entries(STYLES).map(([name, Component]) => (
        <div key={name} style={{ display: "grid", gap: 4 }}>
          <code style={{ fontSize: 12, opacity: 0.5 }}>{name}</code>
          <Component {...args} />
        </div>
      ))}
    </div>
  ),
};
