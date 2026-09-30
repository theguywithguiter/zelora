import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function serialize(announcement: any) {
  return {
    id: announcement.id,
    text: announcement.text,
    position: announcement.position,
    active: announcement.active,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
  };
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });

    return NextResponse.json({
      success: true,
      announcements: announcements.map(serialize),
    });
  } catch (error) {
    console.error("GET ANNOUNCEMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load announcements." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = cleanText(body?.text);

    if (!text) {
      return NextResponse.json(
        { success: false, message: "Announcement text is required." },
        { status: 400 }
      );
    }

    if (text.length > 160) {
      return NextResponse.json(
        { success: false, message: "Announcement must be 160 characters or fewer." },
        { status: 400 }
      );
    }

    const last = await prisma.announcement.findFirst({
      orderBy: { position: "desc" },
    });

    const announcement = await prisma.announcement.create({
      data: {
        text,
        position: (last?.position ?? -1) + 1,
        active: true,
      },
    });

    return NextResponse.json(
      { success: true, announcement: serialize(announcement) },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ANNOUNCEMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create announcement." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = Array.isArray(body?.announcements)
      ? body.announcements
      : [];

    const updates = raw
      .map((item: any, index: number) => ({
        id: Number(item?.id),
        text: cleanText(item?.text),
        active: item?.active === true,
        position: index,
      }))
      .filter(
        (item: { id: number; text: string }) =>
          Number.isInteger(item.id) && item.id > 0 && item.text
      );

    for (const item of updates) {
      if (item.text.length > 160) {
        return NextResponse.json(
          {
            success: false,
            message: "Each announcement must be 160 characters or fewer.",
          },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(
      updates.map((item: { id: number; text: string; active: boolean; position: number }) =>
        prisma.announcement.update({
          where: { id: item.id },
          data: {
            text: item.text,
            active: item.active,
            position: item.position,
          },
        })
      )
    );

    const announcements = await prisma.announcement.findMany({
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });

    return NextResponse.json({
      success: true,
      announcements: announcements.map(serialize),
    });
  } catch (error) {
    console.error("UPDATE ANNOUNCEMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save announcements." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid announcement ID." },
        { status: 400 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    const remaining = await prisma.announcement.findMany({
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });

    await prisma.$transaction(
      remaining.map((item: { id: number }, position) =>
        prisma.announcement.update({
          where: { id: item.id },
          data: { position },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ANNOUNCEMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete announcement." },
      { status: 500 }
    );
  }
}
