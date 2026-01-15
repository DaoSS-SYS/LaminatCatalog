export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const saved: string[] = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;

      // грузим файл в Vercel Blob и получаем публичный URL
      const blob = await put(
        `laminat/${Date.now()}-${f.name || "image"}`,
        f,
        {
          access: "public",
          contentType: f.type || "application/octet-stream",
        }
      );

      saved.push(blob.url);
    }

    return Response.json({ files: saved });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
