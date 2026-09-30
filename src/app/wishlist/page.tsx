import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | ZELORA",
  description:
    "View and manage your saved ZELORA jewellery pieces.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}