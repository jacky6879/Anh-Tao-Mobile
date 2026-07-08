import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "Sửa iPhone Thủ Dầu Một — Anh Táo Mobile", description: "Sửa iPhone tại Thủ Dầu Một — thay pin, thay màn hình, ép kính, lấy liền, bảo hành rõ ràng tại Anh Táo Mobile.", alternates: { canonical: "/sua-iphone-thu-dau-mot" } };

export default function Page() {
  return (
    <SeoLanding
      title="Sửa iPhone Thủ Dầu Một — Anh Táo Mobile"
      h1="Sửa iPhone Thủ Dầu Một — lấy liền, bảo hành rõ ràng"
      description="Sửa iPhone tại Thủ Dầu Một: thay pin, thay màn hình, ép kính, thay chân sạc — lấy liền, bảo hành."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/sua-chua", label: "Sửa chữa" }, { href: "/sua-iphone-thu-dau-mot", label: "Sửa iPhone Thủ Dầu Một" }]}
      body={<p><strong>Sửa iPhone Thủ Dầu Một</strong> — Anh Táo Mobile chuyên sửa chữa iPhone: thay pin, thay màn hình, ép kính, thay chân sạc, sửa main. Lấy liền, báo giá rõ ràng, bảo hành.</p>}
      faqs={[
        { q: "Sửa iPhone ở Thủ Dầu Một mất bao lâu?", a: "Phần lớn dịch vụ lấy liền trong 30–60 phút." },
        { q: "Có cần đặt lịch không?", a: "Nên đặt lịch để phục vụ nhanh, hoặc ghé trực tiếp shop." },
      ]}
      ctaHref="/dat-lich-sua-chua"
      ctaLabel="Đặt lịch sửa iPhone"
    />
  );
}
