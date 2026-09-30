import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      coupons.map((coupon) => ({
        ...coupon,
        type: coupon.discountType,
        value: coupon.discountValue,
      }))
    );
  } catch (error) {
    console.error("Coupons GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const code =
      typeof body?.code === "string"
        ? body.code.trim().toUpperCase()
        : "";

    const type = body?.type;
    const value = Number(body?.value);
    const minOrder = Math.max(0, Number(body?.minOrder) || 0);
    const maxUses = Math.max(0, Math.floor(Number(body?.maxUses) || 0));
    const active = body?.active !== false;

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    if (!["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Discount type must be PERCENTAGE or FIXED" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json(
        { success: false, message: "Discount value must be greater than 0" },
        { status: 400 }
      );
    }

    if (type === "PERCENTAGE" && value > 100) {
      return NextResponse.json(
        { success: false, message: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    let expiresAt: Date | null = null;

    if (body?.expiresAt) {
      expiresAt = new Date(body.expiresAt);

      if (Number.isNaN(expiresAt.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid expiry date" },
          { status: 400 }
        );
      }

      expiresAt.setHours(23, 59, 59, 999);
    }

    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A coupon with this code already exists" },
        { status: 409 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType: type,
        discountValue: value,
        minOrder,
        maxUses,
        expiresAt,
        active,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully",
        coupon: {
          ...coupon,
          type: coupon.discountType,
          value: coupon.discountValue,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Coupons POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body?.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid coupon ID is required" },
        { status: 400 }
      );
    }

    if (typeof body?.active !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Active must be true or false" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { active: body.active },
    });

    return NextResponse.json({
      success: true,
      message: body.active ? "Coupon activated" : "Coupon deactivated",
      coupon: {
        ...coupon,
        type: coupon.discountType,
        value: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Coupons PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid coupon ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Coupons DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
