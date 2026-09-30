import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PersonalizationConfig = {
  enabled: boolean;
  fields: Array<{
    id: string;
    type: "text" | "select" | "image";
    label: string;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    options?: string[];
  }>;
};

function normalizeImages(body: any): string[] {
  if (Array.isArray(body?.images)) {
    return body.images
      .filter((image: unknown) => typeof image === "string")
      .map((image: string) => image.trim())
      .filter(Boolean);
  }

  if (typeof body?.image === "string" && body.image.trim()) {
    return [body.image.trim()];
  }

  return [];
}

function normalizePersonalization(body: any): PersonalizationConfig {
  const raw = body?.personalization;

  if (!raw || raw.enabled !== true) {
    return {
      enabled: false,
      fields: [],
    };
  }

  const fields = Array.isArray(raw.fields)
    ? raw.fields
        .map((field: any, index: number) => ({
          id: String(field?.id || `field-${index + 1}`),
          type:
            field?.type === "select"
              ? "select"
              : field?.type === "image"
                ? "image"
                : "text",
          label: String(field?.label || "Personalization").trim(),
          placeholder:
            field?.type === "text"
              ? String(field?.placeholder || "").trim()
              : "",
          required: Boolean(field?.required),
          maxLength:
            field?.type === "text"
              ? Math.min(200, Math.max(1, Number(field?.maxLength) || 30))
              : 0,
          options:
            field?.type === "select" && Array.isArray(field?.options)
              ? field.options
                  .filter((option: unknown) => typeof option === "string")
                  .map((option: string) => option.trim())
                  .filter(Boolean)
              : [],
        }))
        .filter((field: any) => field.label)
    : [];

  return {
    enabled: true,
    fields,
  };
}

function safeParsePersonalization(value: unknown): PersonalizationConfig {
  if (typeof value !== "string" || !value.trim()) {
    return {
      enabled: false,
      fields: [],
    };
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object") {
      return {
        enabled: false,
        fields: [],
      };
    }

    return normalizePersonalization({
      personalization: parsed,
    });
  } catch (error) {
    console.warn(
      "Invalid product personalization JSON. Using an empty configuration.",
      error
    );

    return {
      enabled: false,
      fields: [],
    };
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      products.map((product) => ({
        ...product,
        image: product.images[0]?.url ?? null,
        personalization: safeParsePersonalization(product.personalization),
      }))
    );
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        message: "Failed to load products.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const description = String(body?.description || "").trim();
    const sku = String(body?.sku || "").trim().toUpperCase();
    const price = Number(body?.price);
    const stock = Number(body?.stock);
    const category = String(body?.category || "").trim();

    if (!name || !description || !sku || !Number.isFinite(price) || !category) {
      return NextResponse.json(
        { message: "Name, SKU, description, price and category are required." },
        { status: 400 }
      );
    }

    if (sku.length > 100) {
      return NextResponse.json(
        { message: "SKU must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    if (price < 0 || stock < 0 || !Number.isFinite(stock)) {
      return NextResponse.json(
        { message: "Price and stock must be valid non-negative numbers." },
        { status: 400 }
      );
    }

    const slugBase =
      String(body?.slug || name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const slug = `${slugBase}-${Date.now()}`;

    const categorySlug = category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const savedCategory = await prisma.category.upsert({
      where: {
        slug: categorySlug,
      },
      update: {},
      create: {
        name: category,
        slug: categorySlug,
      },
    });

    const imageUrls = normalizeImages(body);
    const personalization = normalizePersonalization(body);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock: Math.floor(stock),
        sku,
        categoryId: savedCategory.id,
        personalization: JSON.stringify(personalization),
        images: {
          create: imageUrls.map((url, position) => ({
            url,
            alt: name,
            position,
          })),
        },
      },
      include: {
        category: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        ...product,
        image: product.images[0]?.url ?? null,
        personalization,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A product with this SKU already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create product." },
      { status: 500 }
    );
  }
}
