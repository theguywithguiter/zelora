import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, getSession } from "@/lib/auth";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return cleanString(value).toLowerCase();
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile GET error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load your profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name = cleanString(body?.name);
    const email = normalizeEmail(body?.email);
    const phone = cleanString(body?.phone);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (name.length > 120) {
      return NextResponse.json(
        { success: false, message: "Name is too long." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.userId,
        },
      },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
        phone: phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Refresh the session so the authentication cookie contains
    // the newly saved name/email as well.
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unable to update profile." },
      { status: 500 }
    );
  }
}
