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

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported image format.",
        },
        { status: 400 }
      );
    }

    /*
     * Generate a unique filename.
     * We don't trust the original filename because it may contain
     * spaces, special characters or unsafe path characters.
     */
    const uniqueName = `product-${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      uniqueName
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    });
  } catch (error) {
    console.error("Product image upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload image.",
      },
      { status: 500 }
    );
  }
}