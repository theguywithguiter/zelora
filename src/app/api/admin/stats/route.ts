import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [products, orders, customers, coupons] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
      prisma.coupon.count(),
    ]);

    const recentOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        products,
        orders,
        customers,
        coupons,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics",
      },
      { status: 500 }
    );
  }
}