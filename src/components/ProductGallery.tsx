"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const all = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square surface-card overflow-hidden bg-[var(--bg-subtle)]">
        {all[active] ? (
          <Image src={all[active]} alt={alt} fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-token">Chưa có ảnh</div>
        )}
      </div>
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 rounded-md overflow-hidden border-2 ${i === active ? "border-[var(--brand-primary)]" : "border-token"}`}
            >
              {img ? (
                <Image src={img} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover" />
              ) : (
                <span className="text-xs text-muted-token">—</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
