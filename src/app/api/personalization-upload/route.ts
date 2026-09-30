import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file was provided.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be 10 MB or smaller.",
        },
        { status: 400 }
      );
    }

    const extension = EXTENSIONS[file.type];

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "customizations"
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const filename = `pending-${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}${extension}`;

    const filePath = path.join(
      uploadDirectory,
      filename
    );

    const arrayBuffer = await file.arrayBuffer();

    // Store the original bytes exactly as uploaded.
    await fs.writeFile(
      filePath,
      Buffer.from(arrayBuffer)
    );

    return NextResponse.json({
      success: true,
      url: `/uploads/customizations/${filename}`,
      filename,
    });
  } catch (error) {
    console.error(
      "Personalization upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload image.",
      },
      { status: 500 }
    );
  }
}
