export const CONTACT_EMAILS = ["hello@happengroup.com.au"];

// Rendered as label + input pairs; `rows` marks the one multi-line field.
export const FORM_FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "message", label: "Message", rows: 3 },
];
