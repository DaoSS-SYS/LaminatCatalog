"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Filters, FiltersState } from "@/components/Filters";
import { ColorCard } from "@/components/ColorCard";
import { Lightbox } from "@/components/Lightbox";
import { ColorItem } from "@/lib/types";

function toQuery(f: FiltersState, take: number) {
  const p = new URLSearchParams();
  const q = (f.q ?? "").trim();
  if (q) p.set("q", q);
  if (f.tone) p.set("tone", f.tone);
  p.set("take", String(take));
  p.set("skip", "0");
  return p.toString();
}

export default function Page() {
  const [filters, setFilters] = useState<FiltersState>({
    q: "",
    tone: ""
  });

  const [items, setItems] = useState<ColorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // грузим сразу много, без кнопок вперед/назад
  const [take] = useState(10000);

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null }>({
    open: false,
    src: null
  });

  const query = useMemo(() => toQuery(filters, take), [filters, take]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/colors?${query}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((d) => {
        setItems(d.items ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container-page py-6">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Filters value={filters} onChange={(v) => setFilters(v)} />

          <section className="space-y-4">
            <div>
              <div className="text-lg font-semibold">Каталог</div>
              <div className="text-sm text-zinc-600">
                {loading ? "Загрузка..." : `Найдено: ${total}`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((it) => (
                <ColorCard
                  key={it.id}
                  item={it}
                  onOpen={(src) => setLightbox({ open: true, src })}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Lightbox
        open={lightbox.open}
        src={lightbox.src}
        onClose={() => setLightbox({ open: false, src: null })}
      />

      <footer className="border-t border-zinc-200 py-6">
        <div className="container-page text-xs text-zinc-500">
          © ООО «СОЮЗТОРГ-М». Все права защищены.
        </div>
      </footer>
    </div>
  );
}
