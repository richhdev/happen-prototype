import { readFileSync } from "node:fs";
import path from "node:path";
import PreloaderOverlay from "./PreloaderOverlay";

// The logo is inlined into the document for performance
const SOURCE = path.join(process.cwd(), "public/assets/logo-draw.svg");

export default function Preloader() {
  // Get the logo markup at buildtime
  const logoMarkup = readFileSync(SOURCE, "utf8");
  return <PreloaderOverlay logoMarkup={logoMarkup} />;
}
