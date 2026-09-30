import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateDiscount(
  subtotal: number,
  discountType: string,
  discountValue: number
) {
  if (
    discountType === "PERCENTAGE" ||
    discountType === "percentage"
  ) {
    return Math.min(
      subtotal,
      (subtotal * discountValue) / 100
    );
  }

  return Math.min(subtotal, discountValue);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const code =
      typeof body?.code === "string"
        ? body.code.trim().toUpperCase()
        : "";

    const subtotal = Number(body?.subtotal);

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Enter a coupon code." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order subtotal." },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "That coupon does not exist." },
        { status: 404 }
      );
    }

    if (!coupon.active) {
      return NextResponse.json(
        { success: false, message: "That coupon is currently inactive." },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
      return NextResponse.json(
        { success: false, message: "This coupon has expired." },
        { status: 400 }
      );
    }

    if (
      coupon.maxUses > 0 &&
      coupon.usedCount >= coupon.maxUses
    ) {
      return NextResponse.json(
        { success: false, message: "This coupon has reached its usage limit." },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json(
        {
          success: false,
          message: `This coupon requires a minimum order of ₹${coupon.minOrder.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    const discount = calculateDiscount(
      subtotal,
      coupon.discountType,
      coupon.discountValue
    );

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
      },
      discount,
      total: Math.max(0, subtotal - discount),
      message:
        coupon.discountType === "PERCENTAGE"
          ? `${coupon.discountValue}% discount applied.`
          : `₹${coupon.discountValue.toLocaleString("en-IN")} discount applied.`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to validate coupon." },
      { status: 500 }
    );
  }
}
