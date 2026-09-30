import type { Metadata } from "next";
import ProductClient from "./ProductClient";

type Product = {
  id: number;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  price?: number | null;
  stock?: number | null;
  image?: string | null;
  description?: string | null;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/admin/products/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    return data?.product ?? data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product?.name) {
    return {
      title: "Jewellery | ZELORA",
      description:
        "Discover personalized jewellery crafted by ZELORA for your most meaningful moments.",
    };
  }

  const title = `${product.name} | ZELORA`;

  const description =
    product.description?.trim() ||
    `Discover ${product.name}, a personalized jewellery piece crafted by ZELORA for your most meaningful moments.`;

  const image = product.image || undefined;

  return {
    title,
    description,

    alternates: {
      canonical: `/shop/${id}`,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: `/shop/${id}`,
      siteName: "ZELORA",
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: product.name,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image
        ? {
            images: [image],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductPage() {
  return <ProductClient />;
}