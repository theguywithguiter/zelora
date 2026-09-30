import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type PaymentSettings = {
  cod: boolean;
  upi: boolean;
  card: boolean;
};

const defaultSettings: PaymentSettings = {
  cod: true,
  upi: true,
  card: true,
};

const dataDir = path.join(process.cwd(), "data");
const settingsFile = path.join(dataDir, "payment-settings.json");

async function readSettings(): Promise<PaymentSettings> {
  try {
    const raw = await fs.readFile(settingsFile, "utf8");
    const parsed = JSON.parse(raw);

    return {
      cod: parsed?.cod !== false,
      upi: parsed?.upi !== false,
      card: parsed?.card !== false,
    };
  } catch {
    await fs.mkdir(dataDir, { recursive: true });

    try {
      await fs.writeFile(
        settingsFile,
        JSON.stringify(defaultSettings, null, 2),
        "utf8"
      );
    } catch {
      // If the runtime is read-only, just return defaults.
    }

    return defaultSettings;
  }
}

export async function GET() {
  const settings = await readSettings();

  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const settings: PaymentSettings = {
      cod: body?.cod === true,
      upi: body?.upi === true,
      card: body?.card === true,
    };

    if (!settings.cod && !settings.upi && !settings.card) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one payment method must remain enabled.",
        },
        { status: 400 }
      );
    }

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      settingsFile,
      JSON.stringify(settings, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Payment settings update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save payment settings.",
      },
      { status: 500 }
    );
  }
}
