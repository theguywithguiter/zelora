import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Order number is required.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    position: "asc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "We couldn't find an order with that order number.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        trackingWebsite: order.trackingWebsite,
        total: order.total,
        paymentMethod: order.paymentMethod,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.images[0]?.url ?? null,
              }
            : undefined,
        })),
      },
    });
  } catch (error) {
    console.error("Public track order GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load this order.",
      },
      { status: 500 }
    );
  }
}
