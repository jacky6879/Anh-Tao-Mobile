import { SeoLanding } from "@/components/SeoLanding";
import { prisma } from "@/lib/db";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";

export const metadata = { title: "Trả góp iPhone, iPad, MacBook", description: "Hỗ trợ trả góp iPhone, iPad, MacBook qua ngân hàng và công ty tài chính. Tư vấn hồ sơ nhanh.", alternates: { canonical: "/tra-gop" } };

export default async function Page() {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    select: { id: true, title: true, price: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <SeoLanding
      title="Trả góp tại Anh Táo Mobile"
      h1="Trả góp iPhone, iPad, MacBook"
      description="Hỗ trợ trả góp qua ngân hàng và công ty tài chính — chỉ cần CCCD, duyệt nhanh."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/tra-gop", label: "Trả góp" }]}
      body={
        <>
          <p>Với các sản phẩm được bật tuỳ chọn trả góp, Anh Táo Mobile hỗ trợ:</p>
          <ul>
            <li>Trả góp qua thẻ tín dụng (0% lãi suất với một số ngân hàng)</li>
            <li>Trả góp qua công ty tài chính (Home Credit, FE Credit...)</li>
            <li>Chỉ cần CCCD, duyệt hồ sơ trong 15–30 phút</li>
          </ul>
          <p>Liên hệ shop để biết máy nào đang hỗ trợ trả góp và điều kiện cụ thể.</p>
        </>
      }
      ctaHref="/lien-he"
      ctaLabel="Tư vấn trả góp"
    >
      <InstallmentCalculator products={products} />
    </SeoLanding>
  );
}
