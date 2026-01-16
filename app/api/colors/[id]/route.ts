export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const id = ctx.params.id;
  if (!id) return Response.json({ error: "Bad id" }, { status: 400 });

  try {
    await prisma.color.delete({ where: { id } }); // ВАЖНО: id строка
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/colors/[id] error:", e);
    return Response.json(
      { error: "Delete failed", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
