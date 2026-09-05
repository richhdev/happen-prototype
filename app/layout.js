import { Inter } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const TITLE = "Happen — Melbourne Events Agency";
const DESCRIPTION =
  "A Melbourne-based events agency built on over 10 years of doing the work. Artist services, retail precincts, promoter ticketing, venue bookings and wellness activations.";

export const metadata = {
  // Open Graph and canonical URLs have to be absolute, so every relative path
  // below resolves against this. Without it Next falls back to localhost and
  // the share cards break in production.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description:
      "Behind every event is a team making it Happen. A Melbourne-based events agency with 10+ years of experience.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_AU",
    type: "website",
    // The image comes from app/opengraph-image.png via Next's file convention,
    // which fingerprints the URL and fills in the dimensions.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Behind every event is a team making it Happen. A Melbourne-based events agency with 10+ years of experience.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
