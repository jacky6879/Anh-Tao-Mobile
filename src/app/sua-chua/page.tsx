import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/format";

export const metadata = {
  title: "Sửa chữa iPhone, iPad — thay pin, màn hình, ép kính lấy liền",
  description: "Dịch vụ sửa chữa điện thoại tại Anh Táo Mobile: thay pin, thay màn hình, ép kính, thay chân sạc, sửa main — lấy liền, bảo hành rõ ràng.",
  alternates: { canonical: "/sua-chua" },
};

const GROUPS = ["Thay pin", "Thay màn hình", "Ép kính", "Chân sạc", "Camera", "Loa / Mic", "Face ID", "Mainboard", "Phần mềm", "Vệ sinh máy"];
const ICONS: Record<string, string> = { "Thay pin": "🔋", "Thay màn hình": "📱", "Ép kính": "🪟", "Chân sạc": "🔌", Camera: "📷", "Loa / Mic": "🔊", "Face ID": "🙂", Mainboard: "🧩", "Phần mềm": "💾", "Vệ sinh máy": "🧹" };

export default async function RepairPage() {
  let services: Awaited<ReturnType<typeof list>> = [];
  try { services = await list(); } catch { /* DB */ }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Dịch vụ sửa chữa</h1>
      <p className="text-secondary-token text-sm mb-6">Thay pin, thay màn hình, ép kính, thay chân sạc — lấy liền, bảo hành rõ ràng.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {GROUPS.map((g) => (
          <a key={g} href={`#group-${g}`} className="surface-card p-4 text-center hover:shadow-lg transition">
            <div className="text-3xl mb-1">{ICONS[g] ?? "🛠️"}</div>
            <div className="text-sm font-medium">{g}</div>
          </a>
        ))}
      </div>

      {GROUPS.map((g) => {
        const items = services.filter((s) => s.serviceGroup === g);
        if (items.length === 0) return null;
        return (
          <section key={g} id={`group-${g}`} className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">{g}</h2>
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
