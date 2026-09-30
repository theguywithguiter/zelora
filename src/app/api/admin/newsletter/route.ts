import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      subscribers,
    });
  } catch (error) {
    console.error("Newsletter subscribers GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch newsletter subscribers.",
      },
      { status: 500 }
    );
  }
}
