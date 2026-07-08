import { SeoLanding } from "@/components/SeoLanding";
import { ProductCard } from "@/components/ProductCard";
import { fetchLandingProducts } from "@/lib/landing";

export const metadata = { title: "iPhone mới — New Seal, fullbox", description: "iPhone mới New Seal, fullbox, chưa kích hoạt tại Anh Táo Mobile. Bảo hành chính hãng.", alternates: { canonical: "/iphone-moi" } };

export default async function Page() {
  const products = await fetchLandingProducts({ categorySlug: "iphone", condition: "new_seal", take: 12 });
  return (
    <SeoLanding
      title="iPhone mới tại Anh Táo Mobile"
      h1="iPhone mới — New Seal, fullbox"
      description="iPhone mới nguyên seal, fullbox, chưa kích hoạt. Bảo hành chính hãng 12 tháng."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/san-pham", label: "Sản phẩm" }, { href: "/iphone-moi", label: "iPhone mới" }]}
      body={<p>Anh Táo Mobile cung cấp iPhone mới New Seal, fullbox, chưa kích hoạt với giá tốt và bảo hành chính hãng.</p>}
      ctaHref="/san-pham"
    >
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice} coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />)}
        </div>
      )}
    </SeoLanding>
  );
}
