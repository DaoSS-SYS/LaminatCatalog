"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { TONES } from "@/lib/types";

type FormState = {
  name: string;
  tone: string;
  productType: "laminat" | "quartzvinyl";
};

const init: FormState = {
  name: "",
  tone: "",
  productType: "laminat",
};

export default function Admin() {
  const [token, setToken] = useState("");
  const [form, setForm] = useState<FormState>(init);
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string>("");
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ADMIN_TOKEN") || "";
    setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem("ADMIN_TOKEN", token);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function refresh() {
    const r = await fetch("/api/colors?take=100&skip=0");
    const d = await r.json();
    setList(d.items ?? []);
  }

  async function uploadImages(): Promise<string[]> {
    if (!files || files.length === 0) return [];
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));

    const r = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-admin-token": token },
      body: fd,
    });

    if (!r.ok) throw new Error("Upload failed");

    const d = await r.json();
    return d.files ?? [];
  }

  async function createColor() {
    setStatus("");

    if (!token) {
      setStatus("Укажи ADMIN_TOKEN");
      return;
    }

    if (!form.name.trim()) {
      setStatus("Название обязательно");
      return;
    }

    try {
      const imgs = await uploadImages();

      const payload = {
        name: form.name,
        productType: form.productType, // 🔥 ВАЖНО
        tone: form.tone || null,
        images: imgs,
      };

      const r = await fetch("/api/colors", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || "Create failed");
      }

      setForm(init);
      setFiles(null);

      const input = document.getElementById("fileInput") as HTMLInputElement | null;
      if (input) input.value = "";

      setStatus("Готово: добавлено ✅");
      await refresh();
    } catch (e: any) {
      setStatus(`Ошибка: ${e.message ?? e}`);
    }
  }

  async function remove(id: string) {
    if (!token) return;
    await fetch(`/api/colors/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    await refresh();
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container-page py-8">
        <h1 className="text-2xl font-semibold">Админка</h1>

        <p className="mt-2 text-sm text-zinc-600">
          Добавление товаров (ламинат / кварцвинил)
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[420px_1fr]">
          
          {/* ФОРМА */}
          <div className="card p-5">
            <div className="label mb-1">ADMIN_TOKEN</div>
            <input
              className="input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="вставь токен из .env"
            />

            <div className="hr" />

            <div className="grid grid-cols-2 gap-3">

              {/* НАЗВАНИЕ */}
              <div className="col-span-2">
                <div className="label mb-1">Название *</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* 🔥 ТИП */}
              <div className="col-span-2">
                <div className="label mb-2">Тип покрытия</div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.productType === "laminat"}
                      onChange={() => setForm({ ...form, productType: "laminat" })}
                    />
                    Ламинат
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.productType === "quartzvinyl"}
                      onChange={() => setForm({ ...form, productType: "quartzvinyl" })}
                    />
                    Кварцвинил
                  </label>
                </div>
              </div>

              {/* ОТТЕНОК */}
              <div>
                <div className="label mb-1">Цвет / оттенок</div>
                <select
                  className="select"
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                >
                  <option value="">—</option>
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* ФОТО */}
              <div className="col-span-2">
                <div className="label mb-1">Фото</div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="btn btn-primary w-full" onClick={createColor}>
                Добавить
              </button>
            </div>

            {status && <div className="mt-3 text-sm">{status}</div>}
          </div>

          {/* СПИСОК */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Последние позиции</div>
              <button className="btn" onClick={refresh}>
                Обновить
              </button>
            </div>

            <input
              className="input mb-2"
              placeholder="Поиск по названию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-4 space-y-3">
              {list
                .filter((it) =>
                  it.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.name}</div>

                      <div className="truncate text-xs text-zinc-600">
                        {it.productType === "laminat"
                          ? "Ламинат"
                          : "Кварцвинил"}
                        {it.tone ? ` • ${it.tone}` : ""}
                      </div>
                    </div>

                    <button className="btn" onClick={() => remove(it.id)}>
                      Удалить
                    </button>
                  </div>
                ))}

              {list.length === 0 && (
                <div className="text-sm text-zinc-600">Пока пусто</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}