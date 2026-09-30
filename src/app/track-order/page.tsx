import type { Metadata } from "next";
import { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | ZELORA",
  description:
    "Track your ZELORA jewellery order and check its latest status, shipment progress and delivery information.",

  alternates: {
    canonical: "/track-order",
  },

  openGraph: {
    type: "website",
    title: "Track Your Order | ZELORA",
    description:
      "Track your ZELORA jewellery order and check its latest status, shipment progress and delivery information.",
    url: "/track-order",
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
    title: "Track Your Order | ZELORA",
    description:
      "Track your ZELORA jewellery order and check its latest status, shipment progress and delivery information.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

function TrackOrderLoading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
      }}
    />
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderLoading />}>
      <TrackOrderClient />
    </Suspense>
  );
}
