// The root layout sets `index: true` on everything, and the prototype deploys
// to a public URL, so this one route opts itself back out. A client component
// cannot export metadata, which is why it lives in a layout rather than in
// page.js.
export const metadata = {
  title: "Framer components — Happen",
  robots: { index: false, follow: false },
};

export default function FramerComponentsLayout({ children }) {
  return children;
}
