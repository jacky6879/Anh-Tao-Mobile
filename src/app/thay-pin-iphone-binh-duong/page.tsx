import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "Thay pin iPhone Bình Dương — lấy liền, bảo hành", description: "Thay pin iPhone tại Bình Dương — pin chính hãng, lấy liền 30–45 phút, bảo hành 3 tháng tại Anh Táo Mobile.", alternates: { canonical: "/thay-pin-iphone-binh-duong" } };

export default function Page() {
  return (
    <SeoLanding
      title="Thay pin iPhone Bình Dương — Anh Táo Mobile"
      h1="Thay pin iPhone Bình Dương — lấy liền, bảo hành 3 tháng"
      description="Pin chính hãng, lấy liền 30–45 phút, bảo hành 3 tháng. Thay pin iPhone 11, 12, 13, 14, 15 tại Bình Dương."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/thay-pin-iphone", label: "Thay pin iPhone" }, { href: "/thay-pin-iphone-binh-duong", label: "Thay pin iPhone Bình Dương" }]}
      body={<p><strong>Thay pin iPhone Bình Dương</strong> — Anh Táo Mobile thay pin chính hãng, lấy liền, bảo hành 3 tháng. Đặt lịch trước để được phục vụ nhanh.</p>}
      faqs={[{ q: "Thay pin iPhone ở Bình Dương mất bao lâu?", a: "Khoảng 30–45 phút, lấy liền trong ngày." }]}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch thay pin"
    />
  );
}
