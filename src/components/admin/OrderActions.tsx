"use client";

import { useTransition } from "react";

export function OrderActions({ label, action, variant = "secondary", confirm = false }: {
  label: string;
  action: () => Promise<void>;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  confirm?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const cls = variant === "primary" ? "btn-primary" : variant === "danger" ? "btn-danger" : variant === "ghost" ? "btn-ghost" : "btn-secondary";
  return (
    <button
      disabled={pending}
      onClick={() => { if (!confirm || window.confirm(`${label}?`)) startTransition(() => action()); }}
      className={`btn ${cls} w-full`}
    >
      {pending ? "Đang xử lý..." : label}
    </button>
  );
}
