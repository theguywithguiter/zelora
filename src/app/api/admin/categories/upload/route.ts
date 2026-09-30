import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

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

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("No category image was provided.", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return jsonError(
        "Only JPG, PNG and WEBP images are allowed.",
        400
      );
    }

    if (file.size <= 0) {
      return jsonError("The selected image is empty.", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError(
        "Category image must be 10 MB or smaller.",
        400
      );
    }

    const extension = EXTENSIONS[file.type];

    if (!extension) {
      return jsonError("Unsupported image format.", 400);
    }

    const uniqueName = `category-${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "categories"
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      uniqueName
    );

    const arrayBuffer = await file.arrayBuffer();

    await fs.writeFile(
      filePath,
      Buffer.from(arrayBuffer)
    );

    return NextResponse.json({
      success: true,
      url: `/uploads/categories/${uniqueName}`,
      filename: uniqueName,
    });
  } catch (error) {
    console.error("Category image upload error:", error);

    return jsonError(
      "Unable to upload category image.",
      500
    );
  }
}
