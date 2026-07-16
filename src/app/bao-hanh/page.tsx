import { SeoLanding } from "@/components/SeoLanding";
import { getPageContent } from "@/lib/page-content";

// Content is editable in the admin panel and stored in the DB.
export const dynamic = "force-dynamic";

export const metadata = { title: "Bảo hành — Anh Táo Mobile", description: "Chính sách bảo hành máy cũ và dịch vụ sửa chữa tại Anh Táo Mobile. Rõ ràng, minh bạch.", alternates: { canonical: "/bao-hanh" } };

export default async function Page() {
  const content = await getPageContent("bao-hanh");

  return (
    <SeoLanding
      title={content.ctaTitle}
      h1={content.h1}
      description={content.intro}
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/bao-hanh", label: "Bảo hành" }]}
      body={<div dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />}
      ctaHref="/san-pham"
      ctaLabel="Xem máy đang bán"
    />
  );
}
