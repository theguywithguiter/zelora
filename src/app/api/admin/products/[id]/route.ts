import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function normalizeImages(body: any): string[] | null {
  if (Array.isArray(body?.images)) {
    return body.images
      .filter((image: unknown) => typeof image === "string")
      .map((image: string) => image.trim())
      .filter(Boolean);
  }

  if (typeof body?.image === "string") {
    const image = body.image.trim();
    return image ? [image] : [];
  }

  return null;
}

function normalizePersonalization(body: any) {
  const raw = body?.personalization;

  if (!raw || raw.enabled !== true) {
    return {
      enabled: false,
      fields: [],
    };
  }

  return {
    enabled: true,
    fields: Array.isArray(raw.fields)
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
      : [],
  };
}

function serializeProduct(product: any) {
  return {
    ...product,
    image: product.images?.[0]?.url ?? null,
    personalization: product.personalization
      ? JSON.parse(product.personalization)
      : { enabled: false, fields: [] },
  };
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
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

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: serializeProduct(product),
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load product.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const imageUrls = normalizeImages(body);
    const personalization =
      body?.personalization !== undefined
        ? normalizePersonalization(body)
        : existingProduct.personalization
          ? JSON.parse(existingProduct.personalization)
          : { enabled: false, fields: [] };

    const sku =
      typeof body?.sku === "string"
        ? body.sku.trim().toUpperCase()
        : existingProduct.sku;

    if (!sku) {
      return NextResponse.json(
        { success: false, message: "SKU is required." },
        { status: 400 }
      );
    }

    if (sku.length > 100) {
      return NextResponse.json(
        { success: false, message: "SKU must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    let categoryId = existingProduct.categoryId;

    if (typeof body?.category === "string" && body.category.trim()) {
      const categoryName = body.category.trim();
      const categorySlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const savedCategory = await prisma.category.upsert({
        where: {
          slug: categorySlug,
        },
        update: {},
        create: {
          name: categoryName,
          slug: categorySlug,
        },
      });

      categoryId = savedCategory.id;
    }

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name:
            typeof body?.name === "string"
              ? body.name.trim()
              : existingProduct.name,
          slug:
            typeof body?.slug === "string" && body.slug.trim()
              ? body.slug.trim()
              : existingProduct.slug,
          description:
            body?.description !== undefined
              ? String(body.description || "")
              : existingProduct.description,
          price:
            body?.price !== undefined
              ? Number(body.price)
              : existingProduct.price,
          stock:
            body?.stock !== undefined
              ? Number(body.stock)
              : existingProduct.stock,
          sku,
          categoryId,
          personalization: JSON.stringify(personalization),
        },
      });

      if (imageUrls !== null) {
        await tx.productImage.deleteMany({
          where: {
            productId,
          },
        });

        if (imageUrls.length) {
          await tx.productImage.createMany({
            data: imageUrls.map((url, position) => ({
              url,
              alt: updated.name,
              position,
              productId,
            })),
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: {
          id: productId,
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
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: serializeProduct(product),
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "A product with this SKU already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}
