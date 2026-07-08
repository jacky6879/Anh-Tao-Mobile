import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";
import { fetchLandingServices } from "@/lib/landing";
import { formatPriceRange } from "@/lib/format";

export const metadata = { title: "Ép kính iPhone — trong suốt, không sùi mí", description: "Dịch vụ ép kính iPhone tại Anh Táo Mobile: kính cường lực trong suốt, không sùi mí, bảo hành 3 tháng.", alternates: { canonical: "/ep-kinh-iphone" } };

export default async function Page() {
  const services = await fetchLandingServices({ serviceGroup: "Ép kính", take: 12 });
  return (
    <SeoLanding
      title="Ép kính iPhone tại Anh Táo Mobile"
      h1="Ép kính iPhone — trong suốt, không sùi mí"
      description="Kính cường lực trong suốt, không sùi mí, bảo hành 3 tháng. Ép kính iPhone 11, 12, 13, 14."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/sua-chua", label: "Sửa chữa" }, { href: "/ep-kinh-iphone", label: "Ép kính iPhone" }]}
      body={<p>Kính iPhone vỡ nhưng màn hình bên trong còn nguyên? Anh Táo Mobile ép kính cường lực trong suốt, không sùi mí, lấy liền.</p>}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch ép kính"
    >
      {services.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {services.map((s) => (
            <Link key={s.id} href={`/sua-chua/${s.slug}`} className="surface-card p-4 flex flex-col gap-1">
              <h3 className="font-semibold">{s.title}</h3>
              <div className="flex justify-between mt-auto pt-2">
                <span className="font-bold text-[var(--brand-primary)]">{formatPriceRange(s.priceMin, s.priceMax)}</span>
                {s.estimatedTime && <span className="text-xs text-muted-token">⏱ {s.estimatedTime}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </SeoLanding>
  );
}
