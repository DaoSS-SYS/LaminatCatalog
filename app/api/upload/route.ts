import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const formData = await req.formData();
  const files = formData.getAll("files");

  const saved: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const f of files) {
    if (!(f instanceof File)) continue;
    const arrayBuffer = await f.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const original = f.name || "image";
    const ext = path.extname(original).toLowerCase() || ".jpg";
    const safeExt = [".jpg",".jpeg",".png",".webp"].includes(ext) ? ext : ".jpg";
    const filename = `${randomUUID()}${safeExt}`;
    const full = path.join(uploadDir, filename);

    await fs.writeFile(full, buffer);
    saved.push(`/uploads/${filename}`);
  }

  return Response.json({ files: saved });
}
