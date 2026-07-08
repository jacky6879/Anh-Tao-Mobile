import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "Thay màn hình iPhone Bình Dương — bảo hành 6 tháng", description: "Thay màn hình iPhone tại Bình Dương — màn OLED/LCD, cảm ứng mượt, bảo hành 6 tháng tại Anh Táo Mobile.", alternates: { canonical: "/thay-man-hinh-iphone-binh-duong" } };

export default function Page() {
  return (
    <SeoLanding
      title="Thay màn hình iPhone Bình Dương — Anh Táo Mobile"
      h1="Thay màn hình iPhone Bình Dương — cảm ứng mượt, bảo hành 6 tháng"
      description="Màn OLED/LCD chất lượng, bảo hành 6 tháng. Thay màn hình iPhone 11, 12, 13, 14, 15 tại Bình Dương."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/thay-man-hinh-iphone", label: "Thay màn hình iPhone" }, { href: "/thay-man-hinh-iphone-binh-duong", label: "Thay màn hình iPhone Bình Dương" }]}
      body={<p><strong>Thay màn hình iPhone Bình Dương</strong> — Anh Táo Mobile dùng màn chất lượng, cảm ứng mượt, màu chuẩn, bảo hành 6 tháng.</p>}
      faqs={[{ q: "Thay màn hình có giữ Face ID không?", a: "Có, shop bảo toàn Face ID khi thay đúng quy trình." }]}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch thay màn hình"
    />
  );
}
