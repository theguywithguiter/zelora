import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export type HeroBanner = {
  id: string;
  url: string;
  position: number;
  active: boolean;
};

const filePath = path.join(process.cwd(), "data", "hero-banners.json");

const fallback: HeroBanner[] = [
  {
    id: "default-1",
    url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=2200&q=90",
    position: 0,
    active: true,
  },
  {
    id: "default-2",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2200&q=90",
    position: 1,
    active: true,
  },
  {
    id: "default-3",
    url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=2200&q=90",
    position: 2,
    active: true,
  },
];

async function readBanners(): Promise<HeroBanner[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed
      .filter((item) => item && typeof item.url === "string" && item.url.trim())
      .map((item, index) => ({
        id: String(item.id || `hero-${index + 1}`),
        url: String(item.url).trim(),
        position: index,
        active: item.active !== false,
      }));
  } catch {
    return fallback;
  }
}

async function writeBanners(banners: HeroBanner[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(banners, null, 2), "utf8");
}

export async function GET() {
  try {
    const banners = await readBanners();
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("GET HERO BANNERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load hero banners." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body?.banners) ? body.banners : [];

    const banners: HeroBanner[] = incoming
      .map((item: any, index: number) => ({
        id: String(item?.id || `hero-${Date.now()}-${index}`),
        url: typeof item?.url === "string" ? item.url.trim() : "",
        position: index,
        active: item?.active !== false,
      }))
      .filter((item: HeroBanner) => item.url);

    await writeBanners(banners);

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("SAVE HERO BANNERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save hero banners." },
      { status: 500 }
    );
  }
}
