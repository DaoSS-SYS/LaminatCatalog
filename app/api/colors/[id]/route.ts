import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const id = params.id;
  await prisma.color.delete({ where: { id } }).catch(() => null);
  return Response.json({ ok: true });
}
