"use client";

import { useTransition } from "react";

export function ReviewActions({ label, action, variant = "ghost" }: { label: string; action: () => Promise<void>; variant?: "primary" | "ghost" | "danger" }) {
  const [pending, startTransition] = useTransition();
  const cls = variant === "primary" ? "btn-primary" : variant === "danger" ? "btn-danger" : "btn-ghost";
  return (
    <button disabled={pending} onClick={() => startTransition(() => action())} className={`btn ${cls} btn-sm`}>
      {pending ? "..." : label}
    </button>
  );
}
