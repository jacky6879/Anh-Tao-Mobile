"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  editHref: string;
  deleteAction: () => Promise<void>;
  deleteLabel?: string;
};

export function ProductActions({ editHref, deleteAction, deleteLabel = "Xoá" }: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <Link href={editHref} className="btn btn-ghost p-1" aria-label="Sửa"><Pencil className="h-4 w-4" /></Link>
      <button
        disabled={pending}
        onClick={() => { if (confirm(`${deleteLabel}?`)) startTransition(() => deleteAction()); }}
        className="btn btn-ghost p-1 text-[var(--danger)]"
        aria-label={deleteLabel}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
