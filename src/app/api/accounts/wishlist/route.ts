import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function getOrCreateWishlist(userId: number) {
  return prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: { category: true, images: { orderBy: { position: "asc" } } },
          },
        },
      },
    },
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const wishlist = await getOrCreateWishlist(session.userId);
  return NextResponse.json({
    success: true,
    items: wishlist.items.map((item) => ({
      ...item,
      product: { ...item.product, image: item.product.images[0]?.url ?? null },
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const productId = Number(body?.productId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid product." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });

    const wishlist = await prisma.wishlist.upsert({
      where: { userId: session.userId },
      update: {},
      create: { userId: session.userId },
    });

    await prisma.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      update: {},
      create: { wishlistId: wishlist.id, productId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to add to wishlist." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const productId = Number(new URL(request.url).searchParams.get("productId"));
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ success: false, message: "Invalid product." }, { status: 400 });
  }

  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.userId } });
  if (wishlist) {
    await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });
  }

  return NextResponse.json({ success: true });
}
