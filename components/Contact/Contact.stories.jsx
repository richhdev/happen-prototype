import Contact from "./Contact";
import ContactForm from "./ContactForm";

export default {
  title: "Sections/Contact",
  component: Contact,
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};

export const Default = {};

export const Form = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ContactForm />
    </div>
  ),
};
