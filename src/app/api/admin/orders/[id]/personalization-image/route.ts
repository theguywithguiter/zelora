import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function contentTypeFor(extension: string) {
  switch (extension.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const orderId = Number(id);
    const itemId = Number(
      request.nextUrl.searchParams.get("itemId")
    );

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0 ||
      !Number.isInteger(itemId) ||
      itemId <= 0
    ) {
      return new NextResponse("Invalid order or item.", {
        status: 400,
      });
    }

    const item = await prisma.orderItem.findFirst({
      where: {
        id: itemId,
        orderId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    if (!item?.personalizationImageUrl) {
      return new NextResponse(
        "Personalization image not found.",
        { status: 404 }
      );
    }

    const url = item.personalizationImageUrl;

    if (!url.startsWith("/uploads/customizations/")) {
      return new NextResponse(
        "Invalid personalization image.",
        { status: 400 }
      );
    }

    const relativePath = url.replace(/^\/+/, "");

    const publicRoot = path.resolve(
      process.cwd(),
      "public"
    );

    const filePath = path.resolve(
      publicRoot,
      relativePath
    );

    if (
      filePath !== publicRoot &&
      !filePath.startsWith(`${publicRoot}${path.sep}`)
    ) {
      return new NextResponse(
        "Invalid image path.",
        { status: 400 }
      );
    }

    const buffer = await fs.readFile(filePath);

    const extension =
      path.extname(filePath).toLowerCase() ||
      ".jpg";

    /*
     * The system-generated order number is the customer/order ID
     * shown in the Admin Orders section.
     *
     * Example:
     * ZEL-M3ABC123-12AB34.jpg
     */
    const orderIdentifier =
      safeFilename(
        item.order.orderNumber ||
          String(item.order.id)
      );

    const filename =
      `${orderIdentifier}${extension}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          contentTypeFor(extension),
        "Content-Length":
          String(buffer.byteLength),
        "Content-Disposition":
          `attachment; filename="${filename}"`,
        "Cache-Control":
          "private, no-store",
      },
    });
  } catch (error) {
    console.error(
      "Personalization image download error:",
      error
    );

    return new NextResponse(
      "Unable to download image.",
      { status: 404 }
    );
  }
}
