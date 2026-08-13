import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HH Goa FrameLab — Your Face. Your Build. Your Goa.",
  description:
    "Turn your photo into a share-ready Hacker House Goa 2026 graphic. Create branded PFP frames and Builder ID cards. #FrameInGoa",
  keywords: [
    "Hacker House",
    "Goa 2026",
    "FrameInGoa",
    "hackathon",
    "builder",
    "PFP frame",
    "social graphic",
  ],
  openGraph: {
    title: "HH Goa FrameLab",
    description:
      "Turn your photo into a share-ready Hacker House Goa 2026 graphic.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa FrameLab — Your Face. Your Build. Your Goa.",
    description:
      "Turn your photo into a share-ready Hacker House Goa 2026 graphic. #FrameInGoa",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
