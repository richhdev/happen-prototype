export const CONTACT_EMAILS = ["hello@happengroup.com.au"];

// Rendered as label + input pairs; `rows` marks the one multi-line field.
export const FORM_FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Jane Smith" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@example.com" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "0412 345 678" },
  { name: "message", label: "Message", rows: 3 },
];
