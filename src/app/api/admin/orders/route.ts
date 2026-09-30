import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "PAYMENT_FAILED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const id = Number(body?.id);
    const status = String(body?.status || "") as OrderStatus;
    const hasTrackingNumber = Object.prototype.hasOwnProperty.call(
      body,
      "trackingNumber"
    );
    const hasTrackingWebsite = Object.prototype.hasOwnProperty.call(
      body,
      "trackingWebsite"
    );

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const data: {
      status: OrderStatus;
      trackingNumber?: string | null;
      trackingWebsite?: string | null;
    } = {
      status,
    };

    if (hasTrackingNumber) {
      data.trackingNumber =
        body.trackingNumber == null
          ? null
          : String(body.trackingNumber).trim() || null;
    }

    if (hasTrackingWebsite) {
      const trackingWebsite =
        body.trackingWebsite == null
          ? ""
          : String(body.trackingWebsite).trim();

      if (trackingWebsite) {
        try {
          const trackingUrl = new URL(trackingWebsite);

          if (!["http:", "https:"].includes(trackingUrl.protocol)) {
            throw new Error("Invalid tracking website protocol.");
          }
        } catch {
          return NextResponse.json(
            {
              success: false,
              message: "Tracking website must be a valid HTTP or HTTPS URL.",
            },
            { status: 400 }
          );
        }
      }

      data.trackingWebsite = trackingWebsite || null;
    }

    const order = await prisma.order.update({
      where: {
        id,
      },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: hasTrackingNumber || hasTrackingWebsite
        ? "Order updated successfully."
        : "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Admin orders PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order.",
      },
      { status: 500 }
    );
  }
}
