import { SeoLanding } from "@/components/SeoLanding";

export const metadata = { title: "iPhone cũ Bình Dương — Anh Táo Mobile", description: "Mua iPhone cũ tại Bình Dương — máy đẹp, kiểm tra kỹ, bảo hành rõ ràng. iPhone 12, 13, 14, 15 Pro Max cũ.", alternates: { canonical: "/iphone-cu-binh-duong" } };

export default function Page() {
  return (
    <SeoLanding
      title="iPhone cũ Bình Dương — Anh Táo Mobile"
      h1="iPhone cũ Bình Dương — máy đẹp, bảo hành rõ ràng"
      description="Anh Táo Mobile chuyên iPhone cũ tại Bình Dương: máy đẹp, kiểm tra kỹ, bảo hành 3–12 tháng."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/iphone-cu", label: "iPhone cũ" }, { href: "/iphone-cu-binh-duong", label: "iPhone cũ Bình Dương" }]}
      body={
        <>
          <p>Tìm <strong>iPhone cũ Bình Dương</strong>? Anh Táo Mobile là điểm tin cậy với các dòng iPhone 12, 13, 14, 15 Pro Max cũ — máy đẹp, pin rõ ràng, bảo hành rõ ràng.</p>
          <p>Cam kết: kiểm tra máy công khai bằng 3uTools, báo giá thật, không nói quá, hỗ trợ thu cũ đổi mới và trả góp.</p>
        </>
      }
      faqs={[
        { q: "Ở đâu bán iPhone cũ uy tín tại Bình Dương?", a: "Anh Táo Mobile chuyên iPhone cũ tại Bình Dương, bảo hành rõ ràng, máy được kiểm tra kỹ." },
        { q: "iPhone cũ có bảo hành không?", a: "Có, mỗi máy ghi rõ thời gian bảo hành 3–12 tháng." },
      ]}
    />
  );
}
