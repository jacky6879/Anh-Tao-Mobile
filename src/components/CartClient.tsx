"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { formatVND } from "@/lib/format";
import { removeFromCart, updateQty } from "@/lib/cart/client";

type Line = { id: string; slug: string; title: string; price: number; coverImage: string | null; qty: number };

export function CartClient({ lines }: { lines: Line[] }) {
  return (
    <div className="flex flex-col gap-3">
      {lines.map((l) => (
        <div key={l.id} className="surface-card p-3 flex gap-3 items-center">
          <Link href={`/san-pham/${l.slug}`} className="relative h-16 w-16 rounded-md overflow-hidden bg-[var(--bg-subtle)] shrink-0">
            {l.coverImage ? (
              <Image src={l.coverImage} alt={l.title} fill sizes="64px" className="object-cover" />
            ) : <span className="text-xs text-muted-token flex h-full items-center justify-center">—</span>}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/san-pham/${l.slug}`} className="font-medium text-sm line-clamp-1 hover:text-[var(--brand-primary)]">{l.title}</Link>
            <div className="text-[var(--brand-primary)] font-bold text-sm">{formatVND(l.price)}</div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => updateQty(l.id, l.qty - 1)} className="btn btn-ghost p-1" aria-label="Giảm"><Minus className="h-3 w-3" /></button>
            <span className="w-6 text-center text-sm">{l.qty}</span>
            <button onClick={() => updateQty(l.id, l.qty + 1)} className="btn btn-ghost p-1" aria-label="Tăng"><Plus className="h-3 w-3" /></button>
          </div>
          <button onClick={() => removeFromCart(l.id)} className="btn btn-ghost p-1 text-[var(--danger)]" aria-label="Xoá"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}
