import { SeoLanding } from "@/components/SeoLanding";
import { ProductCard } from "@/components/ProductCard";
import { fetchLandingProducts } from "@/lib/landing";

export const metadata = { title: "iPad cũ/mới — Anh Táo Mobile", description: "iPad cũ/mới tại Anh Táo Mobile. iPad Air, Pro, Gen — kiểm tra kỹ, bảo hành rõ ràng.", alternates: { canonical: "/ipad" } };

export default async function Page() {
  const products = await fetchLandingProducts({ categorySlug: "ipad", take: 12 });
  return (
    <SeoLanding
      title="iPad tại Anh Táo Mobile"
      h1="iPad cũ/mới — máy đẹp, bảo hành rõ ràng"
      description="iPad Air, iPad Pro, iPad Gen cũ/mới — kiểm tra kỹ, pin rõ ràng, bảo hành."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/san-pham", label: "Sản phẩm" }, { href: "/ipad", label: "iPad" }]}
      body={<p>Anh Táo Mobile có các dòng iPad cũ/mới: iPad Gen, iPad Air, iPad Pro. Máy được kiểm tra màn hình, pin, cảm ứng đầy đủ.</p>}
    >
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice} coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />)}
        </div>
      )}
    </SeoLanding>
  );
}
