import { NextResponse } from "next/server";
import {
  createAdminSession,
  clearAdminSession,
  getAdminSession,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      await createAdminSession();

      return NextResponse.json({
        success: true,
        message: "Login successful",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const authenticated = await getAdminSession();

    return NextResponse.json({ success: true, authenticated });
  } catch {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAdminSession();

    return NextResponse.json({
      success: true,
      message: "Admin logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out right now.",
      },
      { status: 500 }
    );
  }
}
