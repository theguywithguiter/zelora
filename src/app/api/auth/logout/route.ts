import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await clearSession();

    return NextResponse.redirect(
      new URL("/account/login", request.url),
      303
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to sign out right now.",
      },
      { status: 500 }
    );
  }
}
