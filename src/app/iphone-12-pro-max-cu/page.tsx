import { SeoLanding } from "@/components/SeoLanding";
import { ProductCard } from "@/components/ProductCard";
import { fetchLandingProducts } from "@/lib/landing";

export const metadata = { title: "iPhone 12 Pro Max cũ — giá tốt, bảo hành", description: "iPhone 12 Pro Max cũ tại Anh Táo Mobile — máy đẹp, pin rõ ràng, bảo hành. Xem máy và giá cập nhật.", alternates: { canonical: "/iphone-12-pro-max-cu" } };

export default async function Page() {
  const products = (await fetchLandingProducts({ categorySlug: "iphone", take: 20 }))
    .filter((p) => /12 pro max/i.test(p.title));
  return (
    <SeoLanding
      title="iPhone 12 Pro Max cũ"
      h1="iPhone 12 Pro Max cũ — máy đẹp, bảo hành rõ ràng"
      description="iPhone 12 Pro Max cũ tại Anh Táo Mobile — kiểm tra kỹ, pin rõ ràng, bảo hành 3 tháng."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/iphone-cu", label: "iPhone cũ" }, { href: "/iphone-12-pro-max-cu", label: "iPhone 12 Pro Max cũ" }]}
      body={<p><strong>iPhone 12 Pro Max cũ</strong> giá tốt tại Anh Táo Mobile. Máy nguyên bản, pin rõ ràng, bảo hành. Hỗ trợ thu cũ đổi mới lên đời 13, 14, 15.</p>}
    >
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice} coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />)}
        </div>
      )}
    </SeoLanding>
  );
}
