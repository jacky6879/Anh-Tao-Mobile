"use client";

import { useTransition } from "react";
import { ShieldCheck, ShieldOff, Ban, CheckCircle2 } from "lucide-react";

export function UserActions({
  isAdmin, status, onToggleAdmin, onToggleBlock,
}: {
  isAdmin: boolean;
  status: string;
  onToggleAdmin: () => Promise<void>;
  onToggleBlock: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <button
        disabled={pending}
        onClick={() => { if (confirm(isAdmin ? "Huỷ quyền admin?" : "Cấp quyền admin?")) startTransition(() => onToggleAdmin()); }}
        className="btn btn-ghost p-1"
        title={isAdmin ? "Huỷ admin" : "Cấp admin"}
      >
        {isAdmin ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => onToggleBlock())}
        className="btn btn-ghost p-1"
        title={status === "active" ? "Khoá" : "Mở khoá"}
      >
        {status === "active" ? <Ban className="h-4 w-4 text-[var(--danger)]" /> : <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />}
      </button>
    </div>
  );
}
