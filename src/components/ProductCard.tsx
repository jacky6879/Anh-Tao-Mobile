import Link from "next/link";
import Image from "next/image";
import { BadgePercent, ShieldCheck } from "lucide-react";
import { formatVND, CONDITION_LABELS } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  coverImage?: string | null;
  condition?: string | null;
  storage?: string | null;
  warranty?: string | null;
  installment?: boolean;
};

export function ProductCard(p: ProductCardProps) {
  return (
    <Link
      href={`/san-pham/${p.slug}`}
      className="group surface-card overflow-hidden flex flex-col transition hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-[var(--bg-subtle)]">
        {p.coverImage ? (
          <Image
            src={p.coverImage}
            alt={p.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-token text-sm">
            Chưa có ảnh
          </div>
        )}
        {p.comparePrice && p.comparePrice > p.price && (
          <span className="absolute top-2 left-2 badge badge-danger">
            -{Math.round((1 - p.price / p.comparePrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--brand-primary)]">
          {p.title}
        </h3>
        {p.storage && <span className="text-xs text-muted-token">{p.storage}</span>}
        <div className="flex items-center gap-1 text-xs text-secondary-token flex-wrap">
          {p.condition && <span className="badge badge-muted">{CONDITION_LABELS[p.condition] ?? p.condition}</span>}
          {p.installment && (
            <span className="badge badge-info"><BadgePercent className="h-3 w-3" /> Trả góp</span>
          )}
        </div>
        <div className="mt-auto pt-2">
          <div className="font-bold text-[var(--brand-primary)]">{formatVND(p.price)}</div>
          {p.comparePrice && p.comparePrice > p.price && (
            <div className="text-xs text-muted-token line-through">{formatVND(p.comparePrice)}</div>
          )}
          {p.warranty && (
            <div className="text-xs text-secondary-token flex items-center gap-1 mt-1">
              <ShieldCheck className="h-3 w-3" /> {p.warranty}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
