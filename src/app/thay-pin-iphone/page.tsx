import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";
import { fetchLandingServices } from "@/lib/landing";
import { formatPriceRange } from "@/lib/format";

export const metadata = { title: "Thay pin iPhone — lấy liền, bảo hành 3 tháng", description: "Dịch vụ thay pin iPhone tại Anh Táo Mobile: pin chính hãng, lấy liền 30–45 phút, bảo hành 3 tháng.", alternates: { canonical: "/thay-pin-iphone" } };

const faqs = [
  { q: "Thay pin iPhone mất bao lâu?", a: "Khoảng 30–45 phút tuỳ dòng máy, lấy liền trong ngày." },
  { q: "Pin thay có chính hãng không?", a: "Có. Shop dùng pin chính hãng/cao cấp, bảo hành 3 tháng." },
  { q: "Làm sao biết pin cần thay?", a: "Pin dưới 80% hoặc sạc nhanh tụt, máy tự tắt là nên thay." },
];

export default async function Page() {
  const services = await fetchLandingServices({ serviceGroup: "Thay pin", take: 12 });
  return (
    <SeoLanding
      title="Thay pin iPhone tại Anh Táo Mobile"
      h1="Thay pin iPhone — lấy liền, bảo hành 3 tháng"
      description="Pin chính hãng, lấy liền 30–45 phút, bảo hành 3 tháng. Thay pin iPhone 11, 12, 13, 14, 15."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/sua-chua", label: "Sửa chữa" }, { href: "/thay-pin-iphone", label: "Thay pin iPhone" }]}
      body={<p>Pin iPhone yếu, sạc nhanh tụt, máy tự tắt? Anh Táo Mobile thay pin chính hãng lấy liền trong 30–45 phút, bảo hành 3 tháng.</p>}
      faqs={faqs}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch thay pin"
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
