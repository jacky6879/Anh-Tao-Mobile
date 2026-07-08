import { SeoLanding } from "@/components/SeoLanding";
import { ProductCard } from "@/components/ProductCard";
import { fetchLandingProducts } from "@/lib/landing";

export const metadata = { title: "iPhone cũ — máy đẹp, bảo hành rõ ràng", description: "iPhone cũ tại Anh Táo Mobile: máy đẹp, kiểm tra kỹ, bảo hành 3–12 tháng. iPhone 12, 13, 14, 15 Pro Max cũ.", alternates: { canonical: "/iphone-cu" } };

const faqs = [
  { q: "iPhone cũ có bảo hành không?", a: "Có, mỗi máy ghi rõ thời gian bảo hành (3–12 tháng tuỳ máy)." },
  { q: "Pin máy cũ còn bao nhiêu?", a: "Tình trạng pin hiển thị ngay trên trang sản phẩm, thường từ 85% trở lên." },
  { q: "Có thu cũ đổi mới không?", a: "Có, bạn gửi máy cũ, shop báo giá rồi trừ vào máy mới." },
];

export default async function Page() {
  const products = await fetchLandingProducts({ categorySlug: "iphone", take: 12 });
  return (
    <SeoLanding
      title="iPhone cũ tại Anh Táo Mobile"
      h1="iPhone cũ — máy đẹp, bảo hành rõ ràng"
      description="iPhone cũ đã kiểm định kỹ, pin rõ ràng, bảo hành 3–12 tháng. iPhone 12, 13, 14, 15 Pro Max cũ giá tốt."
      crumbs={[{ href: "/", label: "Trang chủ" }, { href: "/san-pham", label: "Sản phẩm" }, { href: "/iphone-cu", label: "iPhone cũ" }]}
      body={
        <>
          <p>Mua iPhone cũ tại Anh Táo Mobile bạn được: máy đã kiểm tra kỹ bằng 3uTools, pin rõ ràng, nguồn gốc minh bạch, bảo hành ghi rõ. Không nói quá, không giấu lỗi.</p>
          <p>Các dòng thường có: iPhone 12 / 12 Pro Max, iPhone 13 / 13 Pro Max, iPhone 14 / 14 Pro Max, iPhone 15 / 15 Pro Max.</p>
        </>
      }
      faqs={faqs}
    >
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((p) => (
            <ProductCard key={p.id} slug={p.slug} title={p.title} price={p.price} comparePrice={p.comparePrice} coverImage={p.coverImage} condition={p.condition} storage={p.storage} warranty={p.warranty} installment={p.installment} />
          ))}
        </div>
      )}
    </SeoLanding>
  );
}
