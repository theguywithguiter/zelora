import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Personalized Jewellery Crafted for Every Story",
  description:
    "Discover ZELORA — personalized jewellery crafted to turn meaningful moments, memories and stories into pieces worth keeping.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    title: "ZELORA — Crafted for Every Story",
    description:
      "Personalized jewellery crafted around your most meaningful moments.",
    url: "/",
    siteName: "ZELORA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZELORA — Crafted for Every Story",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZELORA — Crafted for Every Story",
    description:
      "Personalized jewellery crafted around your most meaningful moments.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <HomeClient />;
}