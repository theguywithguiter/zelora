import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Customers GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
      },
      { status: 500 }
    );
  }
}