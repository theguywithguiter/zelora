import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/account/",
        "/accounts/",
        "/cart/",
        "/checkout/",
      ],
    },

    sitemap: "https://shopzelora.in/sitemap.xml",
  };
}