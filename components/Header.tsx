"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="container-page py-3">

        <div className="flex items-center justify-between">

          {/* Левая часть (навигация) */}
          <div className="flex items-center gap-3">
            <Link href="/" className="btn">
              Каталог
            </Link>

            <Link href="/contacts" className="btn">
              Контакты
            </Link>
          </div>

          {/* Центр (главный заголовок) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <div className="text-lg font-semibold tracking-wide">
              ООО «СоюзТорг-М»
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="btn">
              Админка
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}