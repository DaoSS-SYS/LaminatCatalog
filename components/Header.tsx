"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/70 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Laminat<span className="text-zinc-500">Catalog</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="btn" href="/contacts">Контакты</Link>
          <Link className="btn" href="/admin">Админка</Link>
        </nav>
      </div>
    </header>
  );
}
