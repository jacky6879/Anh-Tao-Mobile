import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";

export const metadata = {
  title: "Thu cũ đổi mới iPhone — giá tốt, minh bạch",
  description: "Anh Táo Mobile thu mua iPhone, iPad, MacBook cũ giá tốt. Báo giá rõ ràng, trừ thẳng vào máy mới.",
  alternates: { canonical: "/thu-cu-doi-moi" },
};

const faqs = [
  { q: "Anh Táo thu mua những dòng máy nào?", a: "iPhone, iPad, MacBook, Apple Watch và smartphone Android cũ." },
  { q: "Có cần mang phụ kiện không?", a: "Không bắt buộc, nhưng có hộp/sạc sẽ được giá tốt hơn." },
  { q: "Báo giá mất bao lâu?", a: "Sau khi gửi form, shop liên hệ báo giá trong khoảng 30 phút trong giờ làm việc." },
];

export default function Page() {
  return (
    <SeoLanding
      title="Thu cũ đổi mới tại Anh Táo Mobile"
      h1="Thu cũ đổi mới — lên đời iPhone mới giá tốt"
      description="Gửi thông tin máy cũ, Anh Táo Mobile báo giá thu mua minh bạch rồi trừ vào máy mới."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" }]}
      body={
        <>
          <p>Lên đời iPhone mới chưa bao giờ dễ hơn. Anh Táo Mobile hỗ trợ thu mua máy cũ — iPhone, iPad, MacBook — với quy trình rõ ràng:</p>
          <ul>
            <li>Bạn gửi thông tin máy qua form</li>
            <li>Shop báo giá thu cũ trong 30 phút</li>
            <li>Đồng ý → mang máy tới shop kiểm tra nhanh, trừ tiền vào máy mới</li>
          </ul>
          <p>Máy được kiểm tra công khai, báo giá thật — không ép giá, không nói quá.</p>
        </>
      }
      faqs={faqs}
      ctaHref="/gui-may-thu-cu"
      ctaLabel="Gửi máy thu cũ"
    >
      <div className="surface-card p-6 text-center">
        <Link href="/gui-may-thu-cu" className="btn btn-primary">Gửi yêu cầu thu cũ ngay</Link>
      </div>
    </SeoLanding>
  );
}
