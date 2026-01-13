"use client";

import { useEffect } from "react";

export function Lightbox({
  open,
  src,
  onClose
}: {
  open: boolean;
  src: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* повторный клик по фото закрывает, как просили */}
      <img
        src={src}
        alt=""
        className="max-h-[92vh] w-auto max-w-[92vw] select-none rounded-xl"
        onClick={onClose}
      />
    </div>
  );
}
