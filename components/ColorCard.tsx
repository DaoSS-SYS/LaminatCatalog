"use client";

import { ColorItem } from "@/lib/types";

export function ColorCard({ item, onOpen }: { item: ColorItem; onOpen: (src: string) => void }) {
  const img = item.images?.[0] || "";
  return (
    <div className="card overflow-hidden">
      <button className="block w-full text-left" onClick={() => img && onOpen(img)} aria-label="Открыть фото">
        <div className="aspect-[4/3] w-full bg-zinc-100">
          {img ? (
            <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Нет фото</div>
          )}
        </div>
        <div className="p-3">
          <div className="font-medium leading-tight">{item.name}</div>
          {item.tone ? <div className="mt-1 text-sm text-zinc-600">{item.tone}</div> : null}
        </div>
      </button>
    </div>
  );
}
