import { SeoLanding } from "@/components/SeoLanding";
import { ProductCard } from "@/components/ProductCard";
import { fetchLandingProducts } from "@/lib/landing";

export const metadata = { title: "MacBook cũ/mới — Anh Táo Mobile", description: "MacBook Air, MacBook Pro cũ/mới tại Anh Táo Mobile. Kiểm tra kỹ, bảo hành rõ ràng.", alternates: { canonical: "/macbook" } };

export default async function Page() {
  const products = await fetchLandingProducts({ categorySlug: "macbook", take: 12 });
  return (
    <SeoLanding
      title="MacBook tại Anh Táo Mobile"
      h1="MacBook cũ/mới — máy đẹp, bảo hành rõ ràng"
      description="MacBook Air, MacBook Pro M1/M2/M3 cũ/mới — pin rõ ràng, cấu hình minh bạch."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/san-pham", label: "Sản phẩm" }, { href: "/macbook", label: "MacBook" }]}
      body={<p>Anh Táo Mobile cung cấp MacBook Air, MacBook Pro (M1, M2, M3) cũ/mới. Máy được kiểm tra pin, bàn phím, màn hình, cấu hình minh bạch.</p>}
    >
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice} coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />)}
        </div>
      )}
    </SeoLanding>
  );
}
