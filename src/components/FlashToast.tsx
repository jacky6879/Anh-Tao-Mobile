"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type Flash = { type: "success" | "error" | "info"; message: string };

export function FlashToast() {
  const [flash, setFlash] = useState<Flash | null>(null);

  useEffect(() => {
    try {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("flash="))
        ?.split("=")[1];
      if (!raw) return;
      const parsed = JSON.parse(decodeURIComponent(raw)) as Flash;
      setFlash(parsed);
      // Clear the cookie.
      document.cookie = "flash=; path=/; max-age=0";
      const t = setTimeout(() => setFlash(null), 4000);
      return () => clearTimeout(t);
    } catch {
      /* noop */
    }
  }, []);

  if (!flash) return null;

  const icon =
    flash.type === "success" ? (
      <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
    ) : flash.type === "error" ? (
      <XCircle className="h-5 w-5 text-[var(--danger)]" />
    ) : (
      <Info className="h-5 w-5 text-[var(--info)]" />
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] surface-card shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm"
    >
      {icon}
      <span className="text-sm">{flash.message}</span>
    </div>
  );
}
