import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact ZELORA",
  description:
    "Get in touch with ZELORA for technical support, order queries, returns, replacements, website feedback and direct assistance.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    type: "website",
    title: "Contact ZELORA",
    description:
      "Get in touch with ZELORA for technical support, order queries, returns, replacements, website feedback and direct assistance.",
    url: "/contact",
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
    title: "Contact ZELORA",
    description:
      "Get in touch with ZELORA for technical support, order queries, returns, replacements, website feedback and direct assistance.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}