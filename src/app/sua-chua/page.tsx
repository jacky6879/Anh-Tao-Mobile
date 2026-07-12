import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/format";

export const metadata = {
  title: "Sửa chữa iPhone, iPad — thay pin, màn hình, ép kính lấy liền",
  description: "Dịch vụ sửa chữa điện thoại tại Anh Táo Mobile: thay pin, thay màn hình, ép kính, thay chân sạc, sửa main — lấy liền, bảo hành rõ ràng.",
  alternates: { canonical: "/sua-chua" },
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

export default async function RepairPage() {
  let services: Awaited<ReturnType<typeof list>> = [];
  try { services = await list(); } catch { /* DB */ }

  const uniqueGroups = Array.from(new Set(services.map(s => s.serviceGroup)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Dịch vụ sửa chữa</h1>
      <p className="text-secondary-token text-sm mb-6">Thay pin, thay màn hình, ép kính, thay chân sạc — lấy liền, bảo hành rõ ràng.</p>

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
        const items = services.filter((s) => s.serviceGroup === g);
        if (items.length === 0) return null;
        const config = GROUP_CONFIGS[g] || { label: g, icon: "🛠️" };
        
        return (
          <section key={g} id={`group-${g}`} className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">{config.label}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((s) => (
                <Link key={s.id} href={`/sua-chua/${s.slug}`} className="surface-card p-4 hover:shadow-lg transition flex flex-col gap-1">
                  <h3 className="font-semibold">{s.title}</h3>
                  {s.shortDescription && <p className="text-sm text-secondary-token">{s.shortDescription}</p>}
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

      <div className="surface-card p-6 mt-8 text-center">
        <p className="font-semibold mb-2">Không thấy lỗi của máy?</p>
        <Link href="/dat-lich-sua-chua" className="btn btn-primary">Đặt lịch kiểm tra miễn phí</Link>
      </div>
    </div>
  );
}

async function list() {
  return prisma.repairService.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: [{ featured: "desc" }, { priceMin: "asc" }],
    select: { id: true, slug: true, title: true, shortDescription: true, serviceGroup: true, priceMin: true, priceMax: true, estimatedTime: true },
  });
}
