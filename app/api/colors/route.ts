export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/normalize";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

/**
 * GET /api/colors?q=&tone=&take=&skip=
 * Возвращает список карточек для каталога.
 * Оставили только поиск и оттенок.
 */
const QuerySchema = z.object({
  q: z.string().optional(),
  tone: z.string().optional(),
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return Response.json({ error: "Bad query" }, { status: 400 });

  const { q, tone, take, skip } = parsed.data;

  const where: any = {};

  // Поиск с учетом кириллицы (варианты регистра)
  const qRaw = (q ?? "").trim();
  if (qRaw) {
    const lower = qRaw.toLowerCase();
    const upper = qRaw.toUpperCase();
    const cap = lower.length ? lower[0].toUpperCase() + lower.slice(1) : lower;
    const variants = Array.from(new Set([qRaw, lower, upper, cap])).filter(Boolean);

    where.OR = variants.map((v) => ({ name: { contains: v } }));
  }

  if (tone) where.tone = tone;

  try {
    const [items, total] = await Promise.all([
      prisma.color.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take ?? 60,
        skip: skip ?? 0,
      }),
      prisma.color.count({ where }),
    ]);

    return Response.json({
      total,
      items: items.map((c) => ({
        id: c.id,
        name: c.name,
        tone: c.tone,
        images: parseImages(c.imagesJson),
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("GET /api/colors error:", e);
    // Всегда JSON, чтобы фронт не падал на r.json()
    return Response.json(
      { total: 0, items: [], error: "Database error" },
      { status: 200 }
    );
  }
}

/**
 * POST /api/colors
 * Тело: { name: string, tone?: string, images?: string[] }
 * Создает запись цвета.
 */
const CreateSchema = z.object({
  name: z.string().min(1),
  tone: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  try {
    const body = await req.json().catch(() => null);
    const parsed = CreateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Bad body", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const created = await prisma.color.create({
      data: {
        name: d.name,
        tone: d.tone ?? null,
        imagesJson: JSON.stringify(d.images ?? []),
      },
    });

    return Response.json({ id: created.id });
  } catch (e: any) {
    console.error("POST /api/colors error:", e);
    return Response.json(
      { error: "Create failed", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
