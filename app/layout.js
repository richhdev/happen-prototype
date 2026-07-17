import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Happen — Melbourne Events Agency",
  description:
    "A Melbourne-based events agency built on over 10 years of doing the work. Artist services, market villages, promoter ticketing, venue bookings and wellness activations.",
  openGraph: {
    title: "Happen — Melbourne Events Agency",
    description:
      "Behind every event is a team making it Happen. A Melbourne-based events agency with 10+ years of experience.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: "#EEEBE3" }}>
        {children}
      </body>
    </html>
  );
}
