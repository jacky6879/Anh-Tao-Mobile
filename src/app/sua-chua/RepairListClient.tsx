"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatPriceRange } from "@/lib/format";

type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  serviceGroup: string;
  priceMin: number;
  priceMax: number;
  estimatedTime: string | null;
  deviceModel: string | null;
  partType: string | null;
};

const GROUP_CONFIGS: Record<string, { label: string; icon: string }> = {
  "thay-pin": { label: "Thay pin", icon: "🔋" },
  "thay-man-hinh": { label: "Thay màn hình", icon: "📱" },
  "ep-kinh": { label: "Ép kính", icon: "🪟" },
  "thay-chan-sac": { label: "Thay chân sạc", icon: "🔌" },
  "thay-camera-sau": { label: "Thay camera sau", icon: "📷" },
  "thay-kinh-camera": { label: "Thay kính camera", icon: "🔍" },
  "thay-loa-ngoai": { label: "Thay loa ngoài", icon: "🔊" },
  "thay-loa-trong": { label: "Thay loa trong", icon: "🔈" },
  "do-vo": { label: "Độ vỏ", icon: "✨" },
  "thay-kinh-lung": { label: "Thay kính lưng", icon: "📱" },
  "ep-cam-ung": { label: "Ép cảm ứng", icon: "👆" }
};

export function RepairListClient({ services }: { services: Service[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number | "all">("all");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Search term
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(lowerTerm);
        const matchModel = s.deviceModel?.toLowerCase().includes(lowerTerm);
        const matchDesc = s.shortDescription?.toLowerCase().includes(lowerTerm);
        if (!matchTitle && !matchModel && !matchDesc) return false;
      }
      
      // Group filter
      if (selectedGroup !== "all" && s.serviceGroup !== selectedGroup) {
        return false;
      }

      // Price filter
      if (maxPrice !== "all" && s.priceMin > maxPrice) {
        return false;
      }

      return true;
    });
  }, [services, searchTerm, selectedGroup, maxPrice]);

  const uniqueGroups = Array.from(new Set(filteredServices.map(s => s.serviceGroup)));
  const allGroups = Array.from(new Set(services.map(s => s.serviceGroup)));

  return (
    <div>
      <div className="surface-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="Tìm dòng máy, lỗi, linh kiện..." 
          className="input flex-1 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="input w-full md:w-auto"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="all">Tất cả lỗi / dịch vụ</option>
          {allGroups.map(g => (
            <option key={g} value={g}>{GROUP_CONFIGS[g]?.label || g}</option>
          ))}
        </select>

        <select
          className="input w-full md:w-auto"
          value={maxPrice === "all" ? "all" : maxPrice.toString()}
          onChange={(e) => setMaxPrice(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">Mọi mức giá</option>
          <option value="500000">Dưới 500k</option>
          <option value="1000000">Dưới 1 triệu</option>
          <option value="3000000">Dưới 3 triệu</option>
          <option value="5000000">Dưới 5 triệu</option>
        </select>
      </div>

      {uniqueGroups.length === 0 ? (
        <div className="text-center py-10 text-muted-token">
          Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {uniqueGroups.map((g) => {
              const config = GROUP_CONFIGS[g] || { label: g, icon: "🛠️" };
              return (
                <a key={g} href={`#group-${g}`} className="surface-card p-4 text-center hover:shadow-lg transition">
                  <div className="text-3xl mb-1">{config.icon}</div>
                  <div className="text-sm font-medium">{config.label}</div>
                </a>
              );
            })}
          </div>

          {uniqueGroups.map((g) => {
            const items = filteredServices.filter((s) => s.serviceGroup === g);
            if (items.length === 0) return null;
            const config = GROUP_CONFIGS[g] || { label: g, icon: "🛠️" };
            
            return (
              <section key={g} id={`group-${g}`} className="mb-8 scroll-mt-20">
                <h2 className="text-xl font-bold mb-3">{config.label}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((s) => (
                    <Link key={s.id} href={`/sua-chua/${s.slug}`} className="surface-card p-4 hover:shadow-lg transition flex flex-col gap-1">
                      <h3 className="font-semibold">{s.title}</h3>
                      {(s.shortDescription || s.deviceModel) && (
                        <p className="text-sm text-secondary-token line-clamp-2">
                          {s.deviceModel ? `Dòng máy: ${s.deviceModel}. ` : ''}
                          {s.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-[var(--brand-primary)]">{formatPriceRange(s.priceMin, s.priceMax)}</span>
                        {s.estimatedTime && <span className="text-xs text-muted-token">⏱ {s.estimatedTime}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
