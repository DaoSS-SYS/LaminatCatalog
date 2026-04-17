"use client";

import { useState } from "react";
import { TONES } from "@/lib/types";

export type FiltersState = {
  q: string;
  tone: string;
  productType: "laminat" | "quartzvinyl";
};

const initial: FiltersState = {
  q: "",
  tone: "",
  productType: "laminat",
};

export function Filters({
  value,
  onChange
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const Panel = (
    <div className="space-y-4">

      {/* 🔥 ТИП ПОКРЫТИЯ */}
      <div>
        <div className="label mb-2">Тип покрытия</div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={value.productType === "laminat" ? "btn btn-primary" : "btn"}
            onClick={() => onChange({ ...value, productType: "laminat" })}
          >
            Ламинат
          </button>

          <button
            type="button"
            className={value.productType === "quartzvinyl" ? "btn btn-primary" : "btn"}
            onClick={() => onChange({ ...value, productType: "quartzvinyl" })}
          >
            Кварцвинил
          </button>
        </div>
      </div>

      {/* 🔎 Поиск */}
      <div>
        <div className="label mb-1">Поиск</div>
        <input
          className="input"
          placeholder="Название, артикул, бренд..."
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
      </div>

      {/* 🎨 Оттенок */}
      <div>
        <div className="label mb-1">Оттенок</div>
        <select
          className="select"
          value={value.tone}
          onChange={(e) => onChange({ ...value, tone: e.target.value })}
        >
          <option value="">Любой</option>
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 🔘 Кнопки */}
      <div className="flex gap-2">
        <button className="btn" onClick={() => onChange(initial)}>
          Сбросить
        </button>
        <button className="btn btn-primary" onClick={() => setMobileOpen(false)}>
          Применить
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="card p-4 sticky top-4">
          <div className="mb-3 font-medium">Фильтры</div>
          {Panel}
        </div>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <button className="btn w-full" onClick={() => setMobileOpen(true)}>
          Фильтры
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-medium">Фильтры</div>
                <button className="btn" onClick={() => setMobileOpen(false)}>
                  Закрыть
                </button>
              </div>

              {Panel}
            </div>
          </div>
        )}
      </div>
    </>
  );
}