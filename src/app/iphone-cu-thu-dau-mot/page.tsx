import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "iPhone cũ Thủ Dầu Một — Anh Táo Mobile", description: "Mua iPhone cũ tại Thủ Dầu Một, Bình Dương — máy đẹp, bảo hành rõ ràng tại Anh Táo Mobile.", alternates: { canonical: "/iphone-cu-thu-dau-mot" } };

export default function Page() {
  return (
    <SeoLanding
      title="iPhone cũ Thủ Dầu Một"
      h1="iPhone cũ Thủ Dầu Một — máy đẹp, bảo hành rõ ràng"
      description="Anh Táo Mobile cung cấp iPhone cũ tại Thủ Dầu Một, Bình Dương — kiểm tra kỹ, bảo hành 3–12 tháng."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/iphone-cu", label: "iPhone cũ" }, { href: "/iphone-cu-thu-dau-mot", label: "iPhone cũ Thủ Dầu Một" }]}
      body={<p>Khách ở Thủ Dầu Một cần mua <strong>iPhone cũ</strong> có thể ghé Anh Táo Mobile — máy đẹp, pin rõ ràng, bảo hành rõ ràng, hỗ trợ thu cũ đổi mới.</p>}
      faqs={[{ q: "Có giao máy tại Thủ Dầu Một không?", a: "Có, shop hỗ trợ giao máy và đặt giữ máy online." }]}
    />
  );
}
