import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://YOURDOMAIN.com"),

  title: {
    default: "ZELORA — Crafted for Every Story",
    template: "%s | ZELORA",
  },

  description:
    "Discover ZELORA — personalized jewellery crafted to turn meaningful moments, memories and stories into pieces worth keeping.",

  applicationName: "ZELORA",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "ZELORA",
    title: "ZELORA — Crafted for Every Story",
    description:
      "Personalized jewellery crafted around your most meaningful moments.",
    url: "https://shopzelora.in",
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
