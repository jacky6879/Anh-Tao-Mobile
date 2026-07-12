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

  // Tra cứu trực tiếp (Quick Lookup)
  const [lookupModel, setLookupModel] = useState<string>("");
  const [lookupError, setLookupError] = useState<string>("");

  const allModels = Array.from(new Set(services.map(s => s.deviceModel).filter(Boolean))) as string[];
  allModels.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));

  const allGroups = Array.from(new Set(services.map(s => s.serviceGroup)));

  // Kết quả tra cứu
  const lookupResult = useMemo(() => {
    if (!lookupModel || !lookupError) return null;
    return services.find(s => s.deviceModel === lookupModel && s.serviceGroup === lookupError) || null;
  }, [lookupModel, lookupError, services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(lowerTerm);
        const matchModel = s.deviceModel?.toLowerCase().includes(lowerTerm);
        const matchDesc = s.shortDescription?.toLowerCase().includes(lowerTerm);
        if (!matchTitle && !matchModel && !matchDesc) return false;
      }
      if (selectedGroup !== "all" && s.serviceGroup !== selectedGroup) return false;
      if (maxPrice !== "all" && s.priceMin > maxPrice) return false;
      return true;
    });
  }, [services, searchTerm, selectedGroup, maxPrice]);

  const uniqueGroups = Array.from(new Set(filteredServices.map(s => s.serviceGroup)));

  return (
    <div>
      {/* Khối Tra Cứu Nhanh Trực Quan */}
      <div className="surface-card p-6 mb-8 border-2 border-[var(--brand-primary)]/20 rounded-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔍</span> Tra cứu giá sửa chữa nhanh
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Dòng máy của bạn</label>
            <select 
              className="input w-full"
              value={lookupModel}
              onChange={(e) => setLookupModel(e.target.value)}
            >
              <option value="">-- Chọn dòng máy --</option>
              {allModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lỗi cần sửa chữa</label>
            <select 
              className="input w-full"
              value={lookupError}
              onChange={(e) => setLookupError(e.target.value)}
            >
              <option value="">-- Chọn lỗi / Dịch vụ --</option>
              {allGroups.map(g => (
                <option key={g} value={g}>{GROUP_CONFIGS[g]?.label || g}</option>
              ))}
            </select>
          </div>
        </div>

        {lookupModel && lookupError && (
          <div className="bg-[var(--bg-subtle)] p-5 rounded-lg border border-[var(--border-default)]">
            {lookupResult ? (
              <div>
                <h3 className="text-lg font-bold text-[var(--brand-primary)] mb-3">Kết quả tra cứu: {lookupResult.title}</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-token">Dòng máy:</span> <strong className="ml-1">{lookupResult.deviceModel}</strong>
                  </div>
                  <div>
                    <span className="text-muted-token">Lỗi sửa chữa:</span> <strong className="ml-1">{GROUP_CONFIGS[lookupResult.serviceGroup]?.label || lookupResult.serviceGroup}</strong>
                  </div>
                  <div>
                    <span className="text-muted-token">Chi phí dự kiến:</span> 
                    <strong className="ml-1 text-base text-[var(--brand-primary)]">{formatPriceRange(lookupResult.priceMin, lookupResult.priceMax)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-token">Thời gian xử lý:</span> <strong className="ml-1">{lookupResult.estimatedTime || "30 - 60 phút"}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-token">Linh kiện:</span> <strong className="ml-1">{lookupResult.partType || "Linh kiện Zin / Bóc máy / Chính hãng (Vui lòng liên hệ để kiểm tra tồn kho)"}</strong>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Link href={`/dat-lich-sua-chua?service=${lookupResult.id}`} className="btn btn-primary flex-1 sm:flex-none text-center">
                    Đặt lịch ngay
                  </Link>
                  <Link href={`/sua-chua/${lookupResult.slug}`} className="btn btn-secondary flex-1 sm:flex-none text-center">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-token">
                Xin lỗi, chưa có thông tin giá cho <strong>{GROUP_CONFIGS[lookupError]?.label || lookupError}</strong> trên dòng máy <strong>{lookupModel}</strong>. Vui lòng liên hệ hotline để được báo giá trực tiếp.
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="border-[var(--border-default)] my-8" />

      {/* Tìm kiếm nâng cao / Danh sách toàn bộ */}
      <h2 className="text-lg font-bold mb-4">Hoặc duyệt toàn bộ danh sách dịch vụ</h2>
      
      <div className="surface-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="Tìm dòng máy, lỗi, linh kiện (VD: iphone 14 pro max vỡ kính)..." 
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
