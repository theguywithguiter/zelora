import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({
      success: true,
      alreadySubscribed: false,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to subscribe right now.",
      },
      { status: 500 }
    );
  }
}
