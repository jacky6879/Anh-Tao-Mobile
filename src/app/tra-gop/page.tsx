import { SeoLanding } from "@/components/SeoLanding";
import { prisma } from "@/lib/db";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";
import { getPageContent } from "@/lib/page-content";

// DB-backed content; render per request (DB not available at build time on Vercel)
export const dynamic = "force-dynamic";

export const metadata = { title: "Trả góp iPhone, iPad, MacBook", description: "Hỗ trợ trả góp iPhone, iPad, MacBook qua ngân hàng và công ty tài chính. Tư vấn hồ sơ nhanh.", alternates: { canonical: "/tra-gop" } };

export default async function Page() {
  const [products, content] = await Promise.all([
    prisma.product.findMany({
      where: { status: "published" },
      select: { id: true, title: true, price: true },
      orderBy: { createdAt: "desc" },
    }),
    getPageContent("tra-gop"),
  ]);

  return (
    <SeoLanding
      title={content.ctaTitle}
      h1={content.h1}
      description={content.intro}
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/tra-gop", label: "Trả góp" }]}
      body={<div dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />}
      ctaHref="/lien-he"
      ctaLabel="Tư vấn trả góp"
    >
      <InstallmentCalculator products={products} />
    </SeoLanding>
  );
}
