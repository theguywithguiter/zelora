import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serialize(category: any) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image ?? "",
    productCount: category._count?.products ?? 0,
    createdAt: category.createdAt,
  };
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      categories: categories.map(serialize),
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = clean(body?.name);
    const description = clean(body?.description);
    const image = clean(body?.image);
    const slug = makeSlug(clean(body?.slug) || name);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Enter a valid category name." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, description: description || null, image: image || null },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json(
      { success: true, category: serialize(category) },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create category." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body?.id);
    const name = clean(body?.name);
    const description = clean(body?.description);
    const image = clean(body?.image);
    const slug = makeSlug(clean(body?.slug) || name);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID." },
        { status: 400 }
      );
    }

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description: description || null, image: image || null },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({ success: true, category: serialize(category) });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete this category while ${category._count.products} product${category._count.products === 1 ? " is" : "s are"} assigned to it. Reassign the products first.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category." },
      { status: 500 }
    );
  }
}
