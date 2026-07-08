import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";
import { fetchLandingServices } from "@/lib/landing";
import { formatPriceRange } from "@/lib/format";

export const metadata = { title: "Thay màn hình iPhone — cảm ứng mượt, màu chuẩn", description: "Thay màn hình iPhone tại Anh Táo Mobile: màn OLED/LCD chất lượng, cảm ứng mượt, bảo hành 6 tháng.", alternates: { canonical: "/thay-man-hinh-iphone" } };

export default async function Page() {
  const services = await fetchLandingServices({ serviceGroup: "Thay màn hình", take: 12 });
  return (
    <SeoLanding
      title="Thay màn hình iPhone tại Anh Táo Mobile"
      h1="Thay màn hình iPhone — cảm ứng mượt, màu chuẩn"
      description="Màn OLED/LCD chất lượng, bảo hành 6 tháng. Thay màn hình iPhone 11, 12, 13, 14, 15."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/sua-chua", label: "Sửa chữa" }, { href: "/thay-man-hinh-iphone", label: "Thay màn hình iPhone" }]}
      body={<p>Màn hình iPhone vỡ, sọc, chết cảm ứng? Anh Táo Mobile thay màn hình chất lượng, cảm ứng mượt, màu chuẩn, bảo hành 6 tháng.</p>}
      faqs={[{ q: "Thay màn hình có ảnh hưởng Face ID?", a: "Shop bảo toàn Face ID khi thay màn hình đúng quy trình." }]}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch thay màn hình"
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
