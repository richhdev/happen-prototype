import { Section } from "./Section";
import { Heading2 } from "@/components/Heading/Heading";
import { TextMedium } from "@/components/Text/Text";

export default {
  title: "Layout/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
  argTypes: {
    as: { control: "text" },
  },
};

export const Default = {
  render: (args) => (
    <Section {...args}>
      <div style={{ outline: "1px dashed var(--color-grey-500)" }}>
        <Heading2>Section</Heading2>
        <TextMedium>
          The padded, max-width wrapper every section on the page sits in.
        </TextMedium>
      </div>
    </Section>
  ),
};
