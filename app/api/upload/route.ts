export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function sanitizeFilename(name: string) {
  return (name || "image").replace(/[^\w.\- ]+/g, "_").slice(0, 120);
}

function uploadToCloudinary(buffer: Buffer, filename: string) {
  const folder = process.env.CLOUDINARY_FOLDER || "laminat";

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        filename_override: filename,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    // проверка env
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return Response.json(
        { error: "Cloudinary env is not set (CLOUDINARY_*)"},
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    const saved: string[] = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;

      // ограничим типы
      const name = sanitizeFilename(f.name || "image");
      const arrayBuffer = await f.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadToCloudinary(buffer, name);

      // отдаём оптимизированный URL (быстрее на телефоне)
      const optimizedUrl = cloudinary.url(uploaded.public_id, {
        secure: true,
        fetch_format: "auto",
        quality: "auto",
        width: 1600,
        crop: "limit",
      });

      saved.push(optimizedUrl);
    }

    return Response.json({ files: saved });
  } catch (e: any) {
    console.error("Upload failed:", e);
    return Response.json(
      { error: "Upload failed", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
