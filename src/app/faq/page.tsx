import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ — Personalized Jewellery",
  description:
    "Find answers to common questions about ZELORA personalized jewellery, customization, ordering, sizing, care, shipping, returns and payments.",

  alternates: {
    canonical: "/faq",
  },

  openGraph: {
    type: "website",
    title: "FAQ — Personalized Jewellery | ZELORA",
    description:
      "Find answers to common questions about ZELORA personalized jewellery, customization, ordering, sizing, care, shipping, returns and payments.",
    url: "/faq",
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
    title: "FAQ — Personalized Jewellery | ZELORA",
    description:
      "Find answers to common questions about ZELORA personalized jewellery, customization, ordering, sizing, care, shipping, returns and payments.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function FAQPage() {
  return <FAQClient />;
}