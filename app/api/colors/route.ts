import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/normalize";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  q: z.string().optional(),
  tone: z.string().optional(),
  brand: z.string().optional(),
  collection: z.string().optional(),
  wearClass: z.coerce.number().optional(),
  thicknessMm: z.coerce.number().optional(),
  bevelType: z.string().optional(),
  waterResistant: z.coerce.boolean().optional(),
  surfaceType: z.string().optional(),
  inStock: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional()
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return Response.json({ error: "Bad query" }, { status: 400 });

  const {
    q, tone, brand, collection, wearClass, thicknessMm, bevelType,
    waterResistant, surfaceType, inStock, minPrice, maxPrice, take, skip
  } = parsed.data;

  const where: any = {};

  // NOTE: SQLite's case-insensitive comparisons are ASCII-only in many setups.
  // To make search work well for Cyrillic input (e.g., "дуб" vs "Дуб"), we build
  // several JS-normalized variants and use case-sensitive `contains`.
  const qRaw = (q ?? "").trim();
  if (qRaw) {
    const lower = qRaw.toLowerCase();
    const upper = qRaw.toUpperCase();
    const cap = lower.length ? lower[0].toUpperCase() + lower.slice(1) : lower;
    const variants = Array.from(new Set([qRaw, lower, upper, cap])).filter(Boolean);

    where.OR = variants.flatMap((v) => [
      { name: { contains: v } },
      { sku: { contains: v } },
      { brand: { contains: v } },
      { collection: { contains: v } }
    ]);
  }
  if (tone) where.tone = tone;
  if (brand) where.brand = brand;
  if (collection) where.collection = collection;
  if (wearClass) where.wearClass = wearClass;
  if (thicknessMm) where.thicknessMm = thicknessMm;
  if (bevelType) where.bevelType = bevelType;
  if (typeof waterResistant === "boolean") where.waterResistant = waterResistant;
  if (surfaceType) where.surfaceType = surfaceType;
  if (typeof inStock === "boolean") where.inStock = inStock;
  if (minPrice != null || maxPrice != null) {
    where.pricePerM2 = {};
    if (minPrice != null) where.pricePerM2.gte = minPrice;
    if (maxPrice != null) where.pricePerM2.lte = maxPrice;
  }

  try {
  const [items, total] = await Promise.all([
    prisma.color.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: take ?? 60,
      skip: skip ?? 0
    }),
    prisma.color.count({ where })
  ]);

  return Response.json({
    total,
    items: items.map((c) => ({
      id: c.id,
      name: c.name,
      sku: c.sku,
      brand: c.brand,
      collection: c.collection,
      tone: c.tone,
      wearClass: c.wearClass,
      thicknessMm: c.thicknessMm,
      plankSize: c.plankSize,
      bevelType: c.bevelType,
      waterResistant: c.waterResistant,
      surfaceType: c.surfaceType,
      pricePerM2: c.pricePerM2,
      inStock: c.inStock,
      images: parseImages(c.imagesJson),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString()
    }))
  });
  } catch (e) {
    // Always return JSON so the frontend can safely parse the response.
    return Response.json({ total: 0, items: [], error: "Database is not ready. Run npm run migrate and npm run seed." }, { status: 200 });
  }
}

const CreateSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  collection: z.string().optional().nullable(),
  tone: z.string().optional().nullable(),
  wearClass: z.coerce.number().optional().nullable(),
  thicknessMm: z.coerce.number().optional().nullable(),
  plankSize: z.string().optional().nullable(),
  bevelType: z.string().optional().nullable(),
  waterResistant: z.coerce.boolean().optional().default(false),
  surfaceType: z.string().optional().nullable(),
  pricePerM2: z.coerce.number().optional().nullable(),
  inStock: z.coerce.boolean().optional().default(true),
  images: z.array(z.string()).optional().default([])
});

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Bad body", issues: parsed.error.issues }, { status: 400 });

  const d = parsed.data;

  const created = await prisma.color.create({
    data: {
      name: d.name,
      sku: d.sku ?? null,
      brand: d.brand ?? null,
      collection: d.collection ?? null,
      tone: d.tone ?? null,
      wearClass: d.wearClass ?? null,
      thicknessMm: d.thicknessMm ?? null,
      plankSize: d.plankSize ?? null,
      bevelType: d.bevelType ?? null,
      waterResistant: d.waterResistant ?? false,
      surfaceType: d.surfaceType ?? null,
      pricePerM2: d.pricePerM2 ?? null,
      inStock: d.inStock ?? true,
      imagesJson: JSON.stringify(d.images ?? [])
    }
  });

  return Response.json({ id: created.id });
}