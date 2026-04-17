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

  if (f.productType) p.set("productType", f.productType);
  if (q) p.set("q", q);
  if (f.tone) p.set("tone", f.tone);
  p.set("take", String(take));
  p.set("skip", "0");

  return p.toString();
}

export default function Page() {
  const [filters, setFilters] = useState<FiltersState>({
    q: "",
    tone: "",
    productType: "laminat",
  });

  const [items, setItems] = useState<ColorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [take] = useState(10000);

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null }>({
    open: false,
    src: null,
  });

  const query = useMemo(() => toQuery(filters, take), [filters, take]);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`/api/colors?${query}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((d) => {
        setItems(d.items ?? []);
        setTotal(d.total ?? 0);
      })
      .catch((e) => {
        console.error("Catalog load error:", e);
        setItems([]);
        setTotal(0);
        setError("Не удалось загрузить каталог");
      })
      .finally(() => setLoading(false));
  }, [query]);

  const title =
    filters.productType === "quartzvinyl" ? "Каталог кварцвинила" : "Каталог ламината";

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container-page py-6">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Filters value={filters} onChange={setFilters} />

          <section className="space-y-4">
            <div>
              <div className="text-lg font-semibold">{title}</div>
              <div className="text-sm text-zinc-600">
                {loading ? "Загрузка..." : `Найдено: ${total}`}
              </div>
              {error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null}
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {items.map((it) => (
                  <ColorCard
                    key={it.id}
                    item={it}
                    onOpen={(src) => setLightbox({ open: true, src })}
                  />
                ))}
              </div>
            ) : (
              !loading && (
                <div className="card p-6 text-sm text-zinc-600">
                  В выбранной категории пока нет товаров.
                </div>
              )
            )}
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