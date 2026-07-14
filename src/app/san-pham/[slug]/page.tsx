import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Battery, Smartphone } from "lucide-react";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { formatVND, CONDITION_LABELS } from "@/lib/format";
import { Markdown } from "@/lib/markdown";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/SEO/JsonLd";

// ISR: cache rendered product pages, revalidate every 5 minutes
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  let product;
  try {
    product = await prisma.product.findUnique({ where: { slug } });
  } catch {
    return {};
  }
  if (!product) return {};
  return {
    title: product.metaTitle ?? product.title,
    description: product.metaDescription ?? product.shortDescription ?? "",
    alternates: { canonical: `/san-pham/${slug}` },
    // OG image handled by opengraph-image.tsx convention route
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  let product;
  let related: Awaited<ReturnType<typeof relatedProducts>> = [];
  try {
    product = await prisma.product.findUnique({
      where: { slug, deletedAt: null },
      include: { category: true },
    });
    if (product && product.status !== "published") product = null;
    if (product) related = await relatedProducts(product.id, product.categoryId);
  } catch {
    /* DB unavailable */
  }

  if (!product) notFound();

  const gallery = [product.coverImage, ...product.gallery].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: gallery,
          description: product.shortDescription ?? undefined,
          sku: product.id,
          brand: { "@type": "Brand", name: product.brand ?? "Apple" },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "VND",
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: product.condition === "new_seal" 
              ? "https://schema.org/NewCondition" 
              : "https://schema.org/UsedCondition",
          },
          aggregateRating: product.ratingCount
            ? { "@type": "AggregateRating", ratingValue: product.ratingAvg ?? 0, reviewCount: product.ratingCount }
            : undefined,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: env.NEXT_PUBLIC_SITE_URL },
            { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${env.NEXT_PUBLIC_SITE_URL}/san-pham` },
            { "@type": "ListItem", position: 3, name: product.title, item: `${env.NEXT_PUBLIC_SITE_URL}/san-pham/${slug}` },
          ],
        }}
      />

      <nav className="flex items-center gap-1 text-xs text-muted-token mb-4">
        <Link href="/" className="hover:text-primary-token">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/san-pham" className="hover:text-primary-token">Sản phẩm</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary-token">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery images={gallery} alt={product.title} />

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.shortDescription && <p className="text-secondary-token mt-1">{product.shortDescription}</p>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[var(--brand-primary)]">{formatVND(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-muted-token line-through">{formatVND(product.comparePrice)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {product.condition && <Spec label="Tình trạng" value={CONDITION_LABELS[product.condition] ?? product.condition} />}
            {product.storage && <Spec label="Dung lượng" value={product.storage} />}
            {product.color && <Spec label="Màu" value={product.color} />}
            {product.batteryHealth != null && (
              <Spec label="Pin" value={`${product.batteryHealth}%`} icon={<Battery className="h-3 w-3" />} />
            )}
            {product.warranty && <Spec label="Bảo hành" value={product.warranty} icon={<ShieldCheck className="h-3 w-3" />} />}
            {product.brand && <Spec label="Hãng" value={product.brand} icon={<Smartphone className="h-3 w-3" />} />}
            {product.imeiStatus && <Spec label="IMEI" value={product.imeiStatus} />}
            {product.origin && <Spec label="Nguồn gốc" value={product.origin} />}
          </div>

          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="badge badge-success">Còn {product.stock} máy</span>
            ) : (
              <span className="badge badge-warning">Hết hàng — có thể đặt giữ</span>
            )}
            {product.installment && <span className="badge badge-info ml-2">Hỗ trợ trả góp</span>}
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <AddToCartButton productId={product.id} />
            <a href={`https://zalo.me/${env.NEXT_PUBLIC_ZALO}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Tư vấn qua Zalo
            </a>
          </div>

          <p className="text-xs text-muted-token">
            Đặt giữ máy online hoặc ghé shop. Thanh toán cọc qua Sepay nếu cần giao hàng.
          </p>
        </div>
      </div>

      {product.longDescription && (
        <section className="mt-10 surface-card p-6">
          <h2 className="text-xl font-bold mb-3">Mô tả sản phẩm</h2>
          <Markdown>{product.longDescription}</Markdown>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                title={p.title}
                price={p.price}
                comparePrice={p.comparePrice}
                coverImage={p.coverImage}
                condition={p.condition}
                storage={p.storage}
                warranty={p.warranty}
                installment={p.installment}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="surface-subtle rounded-md p-2">
      <div className="text-xs text-muted-token flex items-center gap-1">{icon}{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

async function relatedProducts(id: string, categoryId: string | null) {
  return prisma.product.findMany({
    where: { status: "published", deletedAt: null, id: { not: id }, categoryId: categoryId ?? undefined },
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, price: true, comparePrice: true,
      coverImage: true, condition: true, storage: true, warranty: true, installment: true,
    },
  });
}
