import Link from "next/link";
import { SeoLanding } from "@/components/SeoLanding";
import { getPageContent } from "@/lib/page-content";

// Content is editable in the admin panel and stored in the DB.
export const dynamic = "force-dynamic";

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

export default async function Page() {
  const content = await getPageContent("thu-cu-doi-moi");

  return (
    <SeoLanding
      title={content.ctaTitle}
      h1={content.h1}
      description={content.intro}
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/thu-cu-doi-moi", label: "Thu cũ đổi mới" }]}
      body={<div dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />}
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
