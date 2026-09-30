import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(body: any) {
  return {
    label: clean(body?.label) || "Home",
    firstName: clean(body?.firstName),
    lastName: clean(body?.lastName),
    phone: clean(body?.phone),
    address: clean(body?.address),
    apartment: clean(body?.apartment),
    city: clean(body?.city),
    state: clean(body?.state),
    pincode: clean(body?.pincode),
    isDefault: Boolean(body?.isDefault),
  };
}

function validate(data: ReturnType<typeof normalize>) {
  if (!data.firstName || !data.lastName || !data.phone || !data.address || !data.city || !data.state || !/^\d{6}$/.test(data.pincode)) {
    return "Please complete all required address fields.";
  }
  return null;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ success: true, addresses });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const data = normalize(await request.json());
    const error = validate(data);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({ where: { userId: session.userId }, data: { isDefault: false } });
      }

      const count = await tx.address.count({ where: { userId: session.userId } });
      return tx.address.create({
        data: {
          ...data,
          apartment: data.apartment || null,
          isDefault: data.isDefault || count === 0,
          userId: session.userId,
        },
      });
    });

    return NextResponse.json({ success: true, address: result }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to save address." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, message: "Invalid address." }, { status: 400 });

    const data = normalize(body);
    const error = validate(data);
    if (error) return NextResponse.json({ success: false, message: error }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({ where: { id, userId: session.userId } });
      if (!existing) throw new Error("Address not found.");

      if (data.isDefault) {
        await tx.address.updateMany({ where: { userId: session.userId, id: { not: id } }, data: { isDefault: false } });
      }

      return tx.address.update({
        where: { id },
        data: { ...data, apartment: data.apartment || null },
      });
    });

    return NextResponse.json({ success: true, address: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update address." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, message: "Invalid address." }, { status: 400 });

  const address = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!address) return NextResponse.json({ success: false, message: "Address not found." }, { status: 404 });

  await prisma.address.delete({ where: { id } });

  if (address.isDefault) {
    const replacement = await prisma.address.findFirst({ where: { userId: session.userId }, orderBy: { updatedAt: "desc" } });
    if (replacement) await prisma.address.update({ where: { id: replacement.id }, data: { isDefault: true } });
  }

  return NextResponse.json({ success: true });
}
