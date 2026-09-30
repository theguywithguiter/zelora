import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /*
     * Orders are normally connected directly through userId.
     *
     * The email fallback is intentional here because existing
     * orders may have been created during checkout using the
     * customer's email before the account/session was attached.
     *
     * This lets an authenticated customer see their existing
     * orders without modifying or recreating those orders.
     */
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            userId: session.userId,
          },
          {
            user: {
              email: session.email,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
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

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product.images[0]?.url ?? null,
          },
        })),
      })),
    });
  } catch (error) {
    console.error("Account orders GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load your orders.",
      },
      { status: 500 }
    );
  }
}
